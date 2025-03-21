import { MedusaModule } from "@medusajs/framework/modules-sdk"
import {
  IndexTypes,
  JoinerServiceConfigAlias,
  ModuleJoinerConfig,
  ModuleJoinerRelationship,
} from "@medusajs/framework/types"
import {
  CommonEvents,
  GraphQLUtils,
  kebabCase,
  lowerCaseFirst,
} from "@medusajs/framework/utils"
import { schemaObjectRepresentationPropertiesToOmit } from "@types"
import { baseGraphqlSchema } from "./base-graphql-schema"

export const CustomDirectives = {
  Listeners: {
    configurationPropertyName: "listeners",
    isRequired: true,
    name: "Listeners",
    directive: "@Listeners",
    definition: "directive @Listeners (values: [String!]) on OBJECT",
  },
}

export function makeSchemaExecutable(inputSchema: string) {
  const { schema: cleanedSchema } = GraphQLUtils.cleanGraphQLSchema(inputSchema)

  if (!cleanedSchema) {
    return
  }

  return GraphQLUtils.makeExecutableSchema({
    typeDefs: cleanedSchema,
  })
}

function extractNameFromAlias(
  alias: JoinerServiceConfigAlias | JoinerServiceConfigAlias[]
) {
  const alias_ = Array.isArray(alias) ? alias[0] : alias
  const names = Array.isArray(alias_?.name) ? alias_?.name : [alias_?.name]
  return names[0]
}

function retrieveAliasForEntity(entityName: string, aliases) {
  aliases = aliases ? (Array.isArray(aliases) ? aliases : [aliases]) : []

  for (const alias of aliases) {
    const names = Array.isArray(alias.name) ? alias.name : [alias.name]

    if (alias.entity === entityName) {
      return names[0]
    }

    for (const name of names) {
      if (name.toLowerCase() === entityName.toLowerCase()) {
        return name
      }
    }
  }
}

function retrieveModuleAndAlias(entityName, moduleJoinerConfigs) {
  let relatedModule
  let alias

  for (const moduleJoinerConfig of moduleJoinerConfigs) {
    const moduleSchema = moduleJoinerConfig.schema
    const moduleAliases = moduleJoinerConfig.alias

    /**
     * If the entity exist in the module schema, then the current module is the
     * one we are looking for.
     *
     * If the module does not have any schema, then we need to base the search
     * on the provided aliases. in any case, we try to get both
     */

    if (moduleSchema) {
      const executableSchema = makeSchemaExecutable(moduleSchema)
      const entitiesMap = executableSchema?.getTypeMap()

      if (entitiesMap?.[entityName]) {
        relatedModule = moduleJoinerConfig
      }
    }

    if (relatedModule && moduleAliases) {
      alias = retrieveAliasForEntity(entityName, moduleJoinerConfig.alias)
    }

    if (relatedModule) {
      break
    }
  }

  if (!relatedModule) {
    return { relatedModule: null, alias: null }
  }

  if (!alias) {
    throw new Error(
      `Index Module error, the module ${relatedModule?.serviceName} has a schema but does not have any alias for the entity ${entityName}. Please add an alias to the module configuration and the entity it correspond to in the args under the entity property.`
    )
  }

  return { relatedModule, alias }
}

// TODO: rename util
function retrieveLinkModuleAndAlias({
  primaryEntity,
  primaryModuleConfig,
  foreignEntity,
  foreignModuleConfig,
  moduleJoinerConfigs,
  servicesEntityMap,
}: {
  primaryEntity: string
  primaryModuleConfig: ModuleJoinerConfig
  foreignEntity: string
  foreignModuleConfig: ModuleJoinerConfig
  moduleJoinerConfigs: ModuleJoinerConfig[]
  servicesEntityMap: Record<string, any>
}): {
  entityName: string
  alias: string
  linkModuleConfig: ModuleJoinerConfig
  intermediateEntityNames: string[]
}[] {
  const linkModulesMetadata: {
    entityName: string
    alias: string
    linkModuleConfig: ModuleJoinerConfig
    intermediateEntityNames: string[]
  }[] = []

  for (const linkModuleJoinerConfig of moduleJoinerConfigs.filter(
    (config) => config.isLink && !config.isReadOnlyLink
  )) {
    const linkPrimary =
      linkModuleJoinerConfig.relationships![0] as ModuleJoinerRelationship
    const linkForeign =
      linkModuleJoinerConfig.relationships![1] as ModuleJoinerRelationship

    const isDirectMatch =
      linkPrimary.serviceName === primaryModuleConfig.serviceName &&
      linkForeign.serviceName === foreignModuleConfig.serviceName

    const isReverseMatch =
      linkPrimary.serviceName === foreignModuleConfig.serviceName &&
      linkForeign.serviceName === primaryModuleConfig.serviceName

    if (!(isDirectMatch || isReverseMatch)) {
      continue
    }

    const primaryEntityLinkableKey = isDirectMatch
      ? linkPrimary.foreignKey
      : linkForeign.foreignKey
    const isTheForeignKeyEntityEqualPrimaryEntity =
      primaryModuleConfig.linkableKeys?.[primaryEntityLinkableKey] ===
      primaryEntity

    const foreignEntityLinkableKey = isDirectMatch
      ? linkForeign.foreignKey
      : linkPrimary.foreignKey
    const isTheForeignKeyEntityEqualForeignEntity =
      foreignModuleConfig.linkableKeys?.[foreignEntityLinkableKey] ===
      foreignEntity

    const linkName = linkModuleJoinerConfig.extends?.find((extend) => {
      return (
        (extend.serviceName === primaryModuleConfig.serviceName ||
          extend.relationship.serviceName ===
            foreignModuleConfig.serviceName) &&
        (extend.relationship.primaryKey === primaryEntityLinkableKey ||
          extend.relationship.primaryKey === foreignEntityLinkableKey)
      )
    })?.relationship.serviceName

    if (!linkName) {
      throw new Error(
        `Index Module error, unable to retrieve the link module name for the services ${primaryModuleConfig.serviceName} - ${foreignModuleConfig.serviceName}. Please be sure that the extend relationship service name is set correctly`
      )
    }

    if (!linkModuleJoinerConfig.alias?.[0]?.entity) {
      throw new Error(
        `Index Module error, unable to retrieve the link module entity name for the services ${primaryModuleConfig.serviceName} - ${foreignModuleConfig.serviceName}. Please be sure that the link module alias has an entity property in the args.`
      )
    }

    if (
      isTheForeignKeyEntityEqualPrimaryEntity &&
      isTheForeignKeyEntityEqualForeignEntity
    ) {
      /**
       * The link will become the parent of the foreign entity, that is why the alias must be the one that correspond to the extended foreign module
       */

      linkModulesMetadata.push({
        entityName: linkModuleJoinerConfig.alias[0].entity,
        alias: extractNameFromAlias(linkModuleJoinerConfig.alias),
        linkModuleConfig: linkModuleJoinerConfig,
        intermediateEntityNames: [],
      })
    } else {
      const intermediateEntityName =
        foreignModuleConfig.linkableKeys![foreignEntityLinkableKey]

      const moduleSchema = isDirectMatch
        ? foreignModuleConfig.schema!
        : primaryModuleConfig.schema!

      if (!moduleSchema) {
        throw new Error(
          `Index Module error, unable to retrieve the intermediate entity name for the services ${primaryModuleConfig.serviceName} - ${foreignModuleConfig.serviceName}. Please be sure that the foreign module ${foreignModuleConfig.serviceName} has a schema.`
        )
      }

      let intermediateEntities: string[] = []
      let foundCount = 0
      let foundName: string | null = null
      const isForeignEntityChildOfIntermediateEntity = (
        entityName: string,
        visited: Set<string> = new Set()
      ): boolean => {
        if (visited.has(entityName)) {
          return false
        }
        visited.add(entityName)

        for (const entityType of Object.values(servicesEntityMap)) {
          if (
            entityType.astNode?.kind === "ObjectTypeDefinition" &&
            entityType.astNode?.fields?.some((field) => {
              return (field.type as any)?.type?.name?.value === entityName
            })
          ) {
            if (entityType.name === intermediateEntityName) {
              foundName = entityType.name
              ++foundCount
              return true
            } else {
              const test = isForeignEntityChildOfIntermediateEntity(
                entityType.name,
                visited
              )
              if (test) {
                intermediateEntities.push(entityType.name)
                return true
              }
            }
          }
        }
        return false
      }

      isForeignEntityChildOfIntermediateEntity(
        isDirectMatch ? foreignEntity : primaryEntity
      )

      if (foundCount !== 1) {
        throw new Error(
          `Index Module error, unable to retrieve the intermediate entities for the services ${
            primaryModuleConfig.serviceName
          } - ${foreignModuleConfig.serviceName} between ${
            isDirectMatch ? foreignEntity : primaryEntity
          } and ${intermediateEntityName}. Multiple paths or no path found. Please check your schema in ${
            foreignModuleConfig.serviceName
          }`
        )
      }

      intermediateEntities.push(foundName!)

      /**
       * The link will become the parent of the foreign entity, that is why the alias must be the one that correspond to the extended foreign module
       */

      linkModulesMetadata.push({
        entityName: linkModuleJoinerConfig.alias[0].entity,
        alias: extractNameFromAlias(linkModuleJoinerConfig.alias),
        linkModuleConfig: linkModuleJoinerConfig,
        intermediateEntityNames: intermediateEntities,
      })
    }
  }

  if (!linkModulesMetadata.length) {
    // TODO: change to use the logger
    console.warn(
      `Index Module warning, unable to retrieve the link module that correspond to the entities ${primaryEntity} - ${foreignEntity}.`
    )
  }

  return linkModulesMetadata
}

function getObjectRepresentationRef(
  entityName,
  { objectRepresentationRef }
): IndexTypes.SchemaObjectEntityRepresentation {
  return (objectRepresentationRef[entityName] ??= {
    entity: entityName,
    parents: [],
    alias: "",
    listeners: [],
    moduleConfig: null,
    fields: [],
  })
}

function setCustomDirectives(currentObjectRepresentationRef, directives) {
  for (const customDirectiveConfiguration of Object.values(CustomDirectives)) {
    const directive = directives.find(
      (typeDirective) =>
        typeDirective.name.value === customDirectiveConfiguration.name
    )

    if (!directive) {
      return
    }

    // Only support array directive value for now
    currentObjectRepresentationRef[
      customDirectiveConfiguration.configurationPropertyName
    ] = ((directive.arguments[0].value as any)?.values ?? []).map(
      (v) => v.value
    )
  }
}

function processEntityBasic(
  entityName: string,
  {
    entitiesMap,
    moduleJoinerConfigs,
    objectRepresentationRef,
    processedEntities = new Set<string>(),
  }: {
    entitiesMap: any
    moduleJoinerConfigs: ModuleJoinerConfig[]
    objectRepresentationRef: IndexTypes.SchemaObjectRepresentation
    processedEntities?: Set<string>
  }
) {
  if (processedEntities.has(entityName)) {
    return
  }
  processedEntities.add(entityName)

  const currentObjectRepresentationRef = getObjectRepresentationRef(
    entityName,
    { objectRepresentationRef }
  )

  setCustomDirectives(
    currentObjectRepresentationRef,
    entitiesMap[entityName].astNode?.directives ?? []
  )

  const { relatedModule: currentEntityModule, alias } = retrieveModuleAndAlias(
    entityName,
    moduleJoinerConfigs
  )

  if (
    !currentEntityModule &&
    currentObjectRepresentationRef.listeners.length > 0
  ) {
    const example = JSON.stringify({
      alias: [{ name: "entity-alias", entity: entityName }],
    })
    throw new Error(
      `Index Module error, unable to retrieve the module that corresponds to the entity ${entityName}.\nPlease add the entity to the module schema or add an alias to the joiner config like the example below:\n${example}`
    )
  }

  if (currentEntityModule) {
    objectRepresentationRef._serviceNameModuleConfigMap[
      currentEntityModule.serviceName
    ] = currentEntityModule
    currentObjectRepresentationRef.moduleConfig = currentEntityModule
    currentObjectRepresentationRef.alias = alias
  }
}

function processEntityRelationships(
  entityName: string,
  {
    servicesEntityMap,
    entitiesMap,
    moduleJoinerConfigs,
    objectRepresentationRef,
    processedEntities = new Set<string>(),
  }: {
    servicesEntityMap: Record<string, any>
    entitiesMap: Record<string, any>
    moduleJoinerConfigs: ModuleJoinerConfig[]
    objectRepresentationRef: IndexTypes.SchemaObjectRepresentation
    processedEntities?: Set<string>
  }
) {
  if (processedEntities.has(entityName)) {
    return
  }
  processedEntities.add(entityName)

  const currentObjectRepresentationRef = getObjectRepresentationRef(
    entityName,
    { objectRepresentationRef }
  )

  // Process fields first (this will include references to other entities)
  currentObjectRepresentationRef.fields =
    GraphQLUtils.gqlGetFieldsAndRelations(entitiesMap, entityName) ?? []

  const schemaParentEntity = Object.values(entitiesMap).filter((value: any) => {
    return (
      value.astNode &&
      (value.astNode as GraphQLUtils.ObjectTypeDefinitionNode).fields?.some(
        (field: any) => {
          let currentType = field.type
          while (currentType.type) {
            currentType = currentType.type
          }
          return currentType.name?.value === entityName
        }
      )
    )
  })

  if (!schemaParentEntity.length) {
    return
  }

  /**
   * If the current entity has parent entities, then we need to process them.
   */
  const parentEntityNames = schemaParentEntity.map((parent: any) => {
    return parent.name
  })

  for (const parent of parentEntityNames) {
    /**
     * Retrieve the parent entity field in the schema
     */

    const entityFieldInParent = (
      entitiesMap[parent].astNode as any
    )?.fields?.find((field) => {
      let currentType = field.type
      while (currentType.type) {
        currentType = currentType.type
      }
      return currentType.name?.value === entityName
    })

    const isEntityListInParent =
      entityFieldInParent.type.kind === GraphQLUtils.Kind.LIST_TYPE
    const entityTargetPropertyNameInParent = entityFieldInParent.name.value

    /**
     * Retrieve the parent entity object representation reference.
     */

    const parentObjectRepresentationRef = getObjectRepresentationRef(parent, {
      objectRepresentationRef,
    })
    const parentModuleConfig = parentObjectRepresentationRef.moduleConfig

    if (!currentObjectRepresentationRef.moduleConfig) {
      currentObjectRepresentationRef.parents.push({
        ref: parentObjectRepresentationRef,
        targetProp: entityTargetPropertyNameInParent,
        isList: isEntityListInParent,
      })
      continue
    }

    /**
     * If the parent entity and the current entity are part of the same servive then configure the parent and
     * add the parent id as a field to the current entity.
     */

    if (
      currentObjectRepresentationRef.moduleConfig.serviceName ===
        parentModuleConfig?.serviceName ||
      parentModuleConfig?.isLink
    ) {
      currentObjectRepresentationRef.parents.push({
        ref: parentObjectRepresentationRef,
        targetProp: entityTargetPropertyNameInParent,
        isList: isEntityListInParent,
      })

      currentObjectRepresentationRef.fields.push(
        parentObjectRepresentationRef.alias + ".id"
      )
    } else {
      const linkModuleMetadatas = retrieveLinkModuleAndAlias({
        primaryEntity: parentObjectRepresentationRef.entity,
        primaryModuleConfig: parentModuleConfig,
        foreignEntity: currentObjectRepresentationRef.entity,
        foreignModuleConfig: currentObjectRepresentationRef.moduleConfig,
        moduleJoinerConfigs,
        servicesEntityMap,
      })

      for (const linkModuleMetadata of linkModuleMetadatas) {
        const linkObjectRepresentationRef = getObjectRepresentationRef(
          linkModuleMetadata.entityName,
          { objectRepresentationRef }
        )

        objectRepresentationRef._serviceNameModuleConfigMap[
          linkModuleMetadata.linkModuleConfig.serviceName ||
            linkModuleMetadata.entityName
        ] = currentObjectRepresentationRef.moduleConfig

        /**
         * Add both relationships as parent to the link module and configure it.
         */
        linkObjectRepresentationRef.parents ??= []

        const linkRelationships =
          linkModuleMetadata.linkModuleConfig.relationships!
        for (let idx = 0; idx < linkRelationships.length; idx++) {
          const parentRelationship = linkRelationships[idx]

          const parentRelationshipRef = getObjectRepresentationRef(
            parentRelationship.entity,
            { objectRepresentationRef }
          )

          linkObjectRepresentationRef.parents.push({
            ref: parentRelationshipRef,
            targetProp: parentRelationshipRef.alias,
            isReferenceLink: idx > 0,
          })

          parentRelationshipRef.parents.push({
            ref: linkObjectRepresentationRef,
            targetProp: linkModuleMetadata.alias,
            isReferenceLink: idx > 0,
          })
        }

        linkObjectRepresentationRef.alias = linkModuleMetadata.alias
        linkObjectRepresentationRef.listeners = [
          `${linkModuleMetadata.entityName}.${CommonEvents.ATTACHED}`,
          `${linkModuleMetadata.entityName}.${CommonEvents.DETACHED}`,
        ]
        linkObjectRepresentationRef.moduleConfig =
          linkModuleMetadata.linkModuleConfig

        linkObjectRepresentationRef.fields = [
          "id",
          ...linkModuleMetadata.linkModuleConfig
            .relationships!.map(
              (relationship) =>
                [
                  parentModuleConfig.serviceName,
                  currentObjectRepresentationRef.moduleConfig.serviceName,
                ].includes(relationship.serviceName) && relationship.foreignKey
            )
            .filter((v): v is string => Boolean(v)),
        ]

        /**
         * If the current entity is not the entity that is used to join the link module and the parent entity
         * then we need to add the new entity that join them and then add the link as its parent
         * before setting the new entity as the true parent of the current entity.
         */

        for (
          let i = linkModuleMetadata.intermediateEntityNames.length - 1;
          i >= 0;
          --i
        ) {
          const intermediateEntityName =
            linkModuleMetadata.intermediateEntityNames[i]

          const isLastIntermediateEntity =
            i === linkModuleMetadata.intermediateEntityNames.length - 1

          const parentIntermediateEntityRef = isLastIntermediateEntity
            ? linkObjectRepresentationRef
            : objectRepresentationRef[
                linkModuleMetadata.intermediateEntityNames[i + 1]
              ]

          const {
            relatedModule: intermediateEntityModule,
            alias: intermediateEntityAlias,
          } = retrieveModuleAndAlias(
            intermediateEntityName,
            moduleJoinerConfigs
          )

          const intermediateEntityObjectRepresentationRef =
            getObjectRepresentationRef(intermediateEntityName, {
              objectRepresentationRef,
            })

          objectRepresentationRef._serviceNameModuleConfigMap[
            intermediateEntityModule.serviceName
          ] = intermediateEntityModule

          intermediateEntityObjectRepresentationRef.parents.push({
            ref: parentIntermediateEntityRef,
            targetProp: intermediateEntityAlias,
            isList: true,
          })

          intermediateEntityObjectRepresentationRef.alias =
            intermediateEntityAlias
          intermediateEntityObjectRepresentationRef.listeners = [
            intermediateEntityName + "." + CommonEvents.CREATED,
            intermediateEntityName + "." + CommonEvents.UPDATED,
          ]
          intermediateEntityObjectRepresentationRef.moduleConfig =
            intermediateEntityModule
          intermediateEntityObjectRepresentationRef.fields = ["id"]

          /**
           * We push the parent id only between intermediate entities but not between intermediate and link
           */

          if (!isLastIntermediateEntity) {
            intermediateEntityObjectRepresentationRef.fields.push(
              parentIntermediateEntityRef.alias + ".id"
            )
          }
        }

        /**
         * If there is any intermediate entity then we need to set the last one as the parent field for the current entity.
         * otherwise there is not need to set the link id field into the current entity.
         */

        let currentParentIntermediateRef = linkObjectRepresentationRef
        if (linkModuleMetadata.intermediateEntityNames.length) {
          currentParentIntermediateRef =
            objectRepresentationRef[
              linkModuleMetadata.intermediateEntityNames[0]
            ]
          currentObjectRepresentationRef.fields.push(
            currentParentIntermediateRef.alias + ".id"
          )
        }

        currentObjectRepresentationRef.parents.push({
          ref: currentParentIntermediateRef,
          inSchemaRef: parentObjectRepresentationRef,
          targetProp: entityTargetPropertyNameInParent,
          isList: isEntityListInParent,
        })
      }
    }
  }
}

/**
 * Build a special object which will be used to retrieve the correct
 * object representation using path tree
 *
 * @example
 * {
 *   _schemaPropertiesMap: {
 *     "product": <ProductRef>
 *     "product.variants": <ProductVariantRef>
 *   }
 * }
 */
function buildAliasMap(
  objectRepresentation: IndexTypes.SchemaObjectRepresentation
) {
  const aliasMap: IndexTypes.SchemaObjectRepresentation["_schemaPropertiesMap"] =
    {}

  function recursivelyBuildAliasPath(
    current: IndexTypes.SchemaObjectEntityRepresentation,
    alias = "",
    aliases: { alias: string; shortCutOf?: string }[] = [],
    visited: Set<string> = new Set()
  ): { alias: string; shortCutOf?: string }[] {
    if (visited.has(current.entity)) {
      return []
    }
    visited.add(current.entity)

    if (current.parents?.length) {
      for (const parentEntity of current.parents) {
        /**
         * Here we build the alias from child to parent to get it as parent to child
         */

        const _aliases = recursivelyBuildAliasPath(
          parentEntity.ref,
          `${parentEntity.targetProp}${alias ? "." + alias : ""}`,
          [],
          new Set(visited) // copy of visited set to keep it scoped
        ).map((alias) => ({ alias: alias.alias }))

        aliases.push(..._aliases)

        /**
         * Now if there is a inSchemaRef it means that we had inferred a link module
         * and we want to get the alias path as it would be in the schema provided
         * and it become the short cut path of the full path above
         */

        if (parentEntity.inSchemaRef) {
          const shortCutOf = _aliases.map((a) => a.alias)[0]
          const _aliasesShortCut = recursivelyBuildAliasPath(
            parentEntity.inSchemaRef,
            `${parentEntity.targetProp}${alias ? "." + alias : ""}`,
            [],
            new Set(visited) // copy of visited set to keep it scoped
          ).map((alias_) => {
            return {
              alias: alias_.alias,
              // It has to be the same entry point
              shortCutOf:
                shortCutOf &&
                shortCutOf.split(".")[0] === alias_.alias.split(".")[0]
                  ? shortCutOf
                  : undefined,
            }
          })

          aliases.push(..._aliasesShortCut)
        }
      }
    }

    aliases.push({ alias: current.alias + (alias ? "." + alias : "") })

    return aliases
  }

  for (const objectRepresentationKey of Object.keys(
    objectRepresentation
  ).filter(
    (key) => !schemaObjectRepresentationPropertiesToOmit.includes(key)
  )) {
    const entityRepresentationRef =
      objectRepresentation[objectRepresentationKey]

    const aliases = recursivelyBuildAliasPath(entityRepresentationRef)

    for (const alias of aliases) {
      aliasMap[alias.alias] = {
        ref: entityRepresentationRef,
      }

      if (alias.shortCutOf) {
        aliasMap[alias.alias]["shortCutOf"] = alias.shortCutOf
      }
    }
  }

  return aliasMap
}

function buildSchemaFromFilterableLinks(
  moduleJoinerConfigs: ModuleJoinerConfig[],
  servicesEntityMap: Record<string, any>
): string {
  const allFilterable = moduleJoinerConfigs.flatMap((config) => {
    const entities: any[] = []

    const schema = config.schema

    if (config.isLink) {
      for (const relationship of config.relationships ?? []) {
        if (!relationship.filterable?.length) {
          continue
        }

        const fieldAliasMap: Record<string, string[]> = {}
        for (const extend of config.extends ?? []) {
          fieldAliasMap[extend.serviceName] = Object.keys(
            extend.fieldAlias ?? {}
          )
        }

        const serviceName = relationship.serviceName
        entities.push({
          serviceName,
          entity: relationship.entity,
          fields: Array.from(
            new Set(
              relationship.filterable.concat(fieldAliasMap[serviceName] ?? [])
            )
          ),
          schema,
        })
      }

      return entities
    }

    let aliases = config.alias ?? []
    aliases = (Array.isArray(aliases) ? aliases : [aliases]).filter(
      (a) => a.filterable?.length && a.entity
    )

    for (const alias of aliases) {
      entities.push({
        serviceName: config.serviceName,
        entity: alias.entity,
        fields: Array.from(new Set(alias.filterable)),
        schema,
      })
    }
    return entities
  })

  const getGqlType = (entity, field) => {
    const fieldRef = (servicesEntityMap[entity] as any)?._fields?.[field]

    if (!fieldRef) {
      return
    }

    let currentType = fieldRef.type
    let isArray = false
    while (currentType.ofType) {
      if (currentType instanceof GraphQLUtils.GraphQLList) {
        isArray = true
      }

      currentType = currentType.ofType
    }

    return isArray ? `[${currentType.name}]` : currentType.name
  }

  const schema = allFilterable
    .map(({ serviceName, entity, fields, schema }) => {
      if (!schema) {
        return
      }

      const normalizedEntity = lowerCaseFirst(kebabCase(entity))
      const events = `@Listeners(values: ["${serviceName}.${normalizedEntity}.created", "${serviceName}.${normalizedEntity}.updated", "${serviceName}.${normalizedEntity}.deleted"])`

      const fieldDefinitions = fields
        .map((field) => {
          const type = getGqlType(entity, field) ?? "String"

          return `    ${field}: ${type}`
        })
        .join("\n")

      return `type ${entity} ${events} {
${fieldDefinitions}
}`
    })
    .join("\n\n")

  return schema
}

/**
 * This util build an internal representation object from the provided schema.
 * It will resolve all modules, fields, link module representation to build
 * the appropriate representation for the index module.
 *
 * This representation will be used to re construct the expected output object from a search
 * but can also be used for anything since the relation tree is available through ref.
 *
 * @param schema
 */
export function buildSchemaObjectRepresentation(
  schema
): [IndexTypes.SchemaObjectRepresentation, Record<string, any>] {
  const moduleJoinerConfigs = MedusaModule.getAllJoinerConfigs()
  const servicesEntityMap = makeSchemaExecutable(
    baseGraphqlSchema +
      moduleJoinerConfigs
        .map((joinerConfig) => joinerConfig?.schema ?? "")
        .join("\n")
  )!.getTypeMap()

  const filterableEntities = buildSchemaFromFilterableLinks(
    moduleJoinerConfigs,
    servicesEntityMap
  )

  const augmentedSchema =
    CustomDirectives.Listeners.definition + schema + filterableEntities

  const executableSchema = makeSchemaExecutable(augmentedSchema)!
  const entitiesMap = executableSchema.getTypeMap()

  const objectRepresentation = {
    _serviceNameModuleConfigMap: {},
  } as IndexTypes.SchemaObjectRepresentation

  // Process basic entity information (skip relationships)
  Object.entries(entitiesMap).forEach(([entityName, entityMapValue]) => {
    if (!entityMapValue.astNode) {
      return
    }
    processEntityBasic(entityName, {
      entitiesMap,
      moduleJoinerConfigs,
      objectRepresentationRef: objectRepresentation,
    })
  })

  // Process relationships and fields (handling circular references)
  Object.entries(entitiesMap).forEach(([entityName, entityMapValue]) => {
    if (!entityMapValue.astNode) {
      return
    }
    processEntityRelationships(entityName, {
      servicesEntityMap,
      entitiesMap,
      moduleJoinerConfigs,
      objectRepresentationRef: objectRepresentation,
    })
  })

  objectRepresentation._schemaPropertiesMap =
    buildAliasMap(objectRepresentation)

  return [objectRepresentation, entitiesMap]
}
