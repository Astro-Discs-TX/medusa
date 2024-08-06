import {
  Application,
  Comment,
  Context,
  Converter,
  DeclarationReflection,
  DocumentReflection,
  ParameterReflection,
  ParameterType,
  ReferenceType,
  ReflectionKind,
  SignatureReflection,
} from "typedoc"
import ts, { SyntaxKind, VariableStatement } from "typescript"
import { WorkflowManager, WorkflowDefinition } from "@medusajs/orchestration"
import Helper from "./utils/helper"
import { isWorkflow } from "utils"

/**
 * A plugin that extracts a workflow's steps, hooks, their types, and attaches them as
 * documents to the workflow's reflection.
 */
class WorkflowsPlugin {
  protected app: Application
  protected helper: Helper

  constructor(app: Application) {
    this.app = app
    this.helper = new Helper()

    this.registerOptions()
    this.registerEventHandlers()
  }

  /**
   * Register the plugin's options.
   */
  registerOptions() {
    this.app.options.addDeclaration({
      name: "enableWorkflowsPlugins",
      help: "Whether to enable the workflows plugin.",
      type: ParameterType.Boolean, // The default
      defaultValue: false,
    })
  }

  /**
   * Register event handlers.
   */
  registerEventHandlers() {
    this.app.converter.on(
      Converter.EVENT_RESOLVE_BEGIN,
      this.handleResolve.bind(this)
    )
  }

  /**
   * When the converter begins resolving a project, this method is triggered. It finds
   * all signatures that are workflows and attaches the necessary information to them.
   *
   * @param context - The project's context.
   */
  handleResolve(context: Context) {
    for (const reflection of context.project.getReflectionsByKind(
      ReflectionKind.All
    )) {
      if (!(reflection instanceof SignatureReflection)) {
        continue
      }

      if (isWorkflow(reflection)) {
        const { initializer } =
          this.helper.getReflectionSymbolAndInitializer({
            project: context.project,
            reflection: reflection.parent,
          }) || {}

        if (
          !initializer ||
          (!ts.isArrowFunction(initializer.arguments[1]) &&
            !ts.isFunctionExpression(initializer.arguments[1]))
        ) {
          continue
        }

        const workflowId = this.helper.getStepOrWorkflowId(
          initializer,
          context.project
        )

        if (!workflowId) {
          continue
        }

        this.parseSteps({
          workflowId,
          constructorFn: initializer.arguments[1],
          context,
          parentReflection: reflection.parent,
        })
      }
    }
  }

  /**
   * Parse the steps of a workflow and attach them as documents to the parent reflection.
   *
   * @param param0 - The workflow's details.
   */
  parseSteps({
    workflowId,
    constructorFn,
    context,
    parentReflection,
  }: {
    workflowId: string
    constructorFn: ts.ArrowFunction | ts.FunctionExpression
    context: Context
    parentReflection: DeclarationReflection
  }) {
    // use the workflow manager to check whether something in the constructor
    // body is a step/hook
    const workflow = WorkflowManager.getWorkflow(workflowId)

    if (!ts.isBlock(constructorFn.body)) {
      return
    }

    if (!parentReflection.documents) {
      parentReflection.documents = []
    }

    constructorFn.body.statements.forEach((statement) => {
      let initializer: ts.CallExpression | undefined
      switch (statement.kind) {
        case SyntaxKind.VariableStatement:
          const variableInitializer = (statement as VariableStatement)
            .declarationList.declarations[0].initializer

          if (
            !variableInitializer ||
            !ts.isCallExpression(variableInitializer)
          ) {
            return
          }

          initializer = variableInitializer
          break
        case SyntaxKind.ExpressionStatement:
          const statementInitializer = (statement as ts.ExpressionStatement)
            .expression
          if (!ts.isCallExpression(statementInitializer)) {
            return
          }

          initializer = statementInitializer
      }

      if (!initializer) {
        return
      }

      const { stepId, stepReflection } =
        this.parseStep({
          initializer,
          context,
          workflow,
        }) || {}

      if (!stepId || !stepReflection) {
        return
      }

      const stepModifier = this.helper.getModifier(initializer)

      const documentReflection = new DocumentReflection(
        stepReflection.name,
        stepReflection,
        [],
        {}
      )

      documentReflection.comment = new Comment()
      documentReflection.comment.modifierTags.add(stepModifier)

      parentReflection.documents?.push(documentReflection)
    })
  }

  /**
   * Parse a step to retrieve its ID and reflection.
   *
   * @param param0 - The step's details.
   * @returns The step's ID and reflection, if found.
   */
  parseStep({
    initializer,
    context,
    workflow,
  }: {
    initializer: ts.CallExpression
    context: Context
    workflow?: WorkflowDefinition
  }):
    | {
        stepId: string
        stepReflection: DeclarationReflection
      }
    | undefined {
    const initializerName = this.helper.normalizeName(
      initializer.expression.getText()
    )

    let stepId: string | undefined
    let stepReflection: DeclarationReflection | undefined

    if (
      this.helper.getStepType(initializer) === "hook" &&
      "symbol" in initializer.arguments[1]
    ) {
      // get the hook's name from the first argument
      stepId = this.helper.normalizeName(initializer.arguments[0].getText())
      stepReflection = this.assembleHookReflection({
        stepId,
        context,
        inputSymbol: initializer.arguments[1].symbol as ts.Symbol,
      })
    } else {
      const initializerReflection =
        context.project.getChildByName(initializerName)

      if (
        !initializerReflection ||
        !(initializerReflection instanceof DeclarationReflection)
      ) {
        return
      }

      const { initializer } =
        this.helper.getReflectionSymbolAndInitializer({
          project: context.project,
          reflection: initializerReflection,
        }) || {}

      if (!initializer) {
        return
      }

      stepId = this.helper.getStepOrWorkflowId(
        initializer,
        context.project,
        true
      )
      stepReflection = initializerReflection
    }

    // check if is a step in the workflow
    if (!stepId || !stepReflection || !workflow?.handlers_.get(stepId)) {
      return
    }

    return {
      stepId,
      stepReflection,
    }
  }

  /**
   * This method creates a declaration reflection for a hook, since a hook doesn't have its own reflection.
   *
   * @param param0 - The hook's details.
   * @returns The hook's reflection
   */
  assembleHookReflection({
    stepId,
    context,
    inputSymbol,
  }: {
    stepId: string
    context: Context
    inputSymbol: ts.Symbol
  }): DeclarationReflection {
    const declarationReflection = context.createDeclarationReflection(
      ReflectionKind.Function,
      undefined,
      undefined,
      stepId
    )
    const signatureReflection = new SignatureReflection(
      stepId,
      ReflectionKind.SomeSignature,
      declarationReflection
    )

    const parameter = new ParameterReflection(
      "input",
      ReflectionKind.Parameter,
      signatureReflection
    )

    parameter.type = ReferenceType.createSymbolReference(inputSymbol, context)

    signatureReflection.parameters = []

    signatureReflection.parameters.push(parameter)

    declarationReflection.signatures = []

    declarationReflection.signatures.push(signatureReflection)

    return declarationReflection
  }
}

export default WorkflowsPlugin
