import { BatchMethodRequest } from "@medusajs/types"
import { ProductStatus } from "@medusajs/utils"
import { z } from "zod"
import { GetProductsParams } from "../../utils/common-validators"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

const statusEnum = z.nativeEnum(ProductStatus)

export const AdminGetProductParams = createSelectParams()
export const AdminGetProductVariantParams = createSelectParams()
export const AdminGetProductOptionParams = createSelectParams()

export type AdminGetProductVariantsParamsType = z.infer<
  typeof AdminGetProductVariantsParams
>
export const AdminGetProductVariantsParams = createFindParams({
  offset: 0,
  limit: 50,
}).merge(
  z.object({
    q: z.string().optional(),
    id: z.union([z.string(), z.array(z.string())]).optional(),
    manage_inventory: z.boolean().nullish(),
    allow_backorder: z.boolean().nullish(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
    $and: z.lazy(() => AdminGetProductsParams.array()).optional(),
    $or: z.lazy(() => AdminGetProductsParams.array()).optional(),
  })
)

export type AdminGetProductsParamsType = z.infer<typeof AdminGetProductsParams>
export const AdminGetProductsParams = createFindParams({
  offset: 0,
  limit: 50,
}).merge(
  z
    .object({
      variants: AdminGetProductVariantsParams.nullish(),
      price_list_id: z.string().array().nullish(),
      status: statusEnum.array().nullish(),
      $and: z.lazy(() => AdminGetProductsParams.array()).optional(),
      $or: z.lazy(() => AdminGetProductsParams.array()).optional(),
    })
    .merge(GetProductsParams)
)

export type AdminGetProductOptionsParamsType = z.infer<
  typeof AdminGetProductOptionsParams
>
export const AdminGetProductOptionsParams = createFindParams({
  offset: 0,
  limit: 50,
}).merge(
  z.object({
    q: z.string().optional(),
    id: z.union([z.string(), z.array(z.string())]).optional(),
    title: z.string().nullish(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
    $and: z.lazy(() => AdminGetProductsParams.array()).optional(),
    $or: z.lazy(() => AdminGetProductsParams.array()).optional(),
  })
)

export type AdminCreateProductTagType = z.infer<typeof AdminCreateProductTag>
export const AdminCreateProductTag = z.object({
  value: z.string().nullish(),
})

export type AdminUpdateProductTagType = z.infer<typeof AdminUpdateProductTag>
export const AdminUpdateProductTag = z.object({
  id: z.string().nullish(),
  value: z.string().nullish(),
})

export type AdminCreateProductOptionType = z.infer<
  typeof AdminCreateProductOption
>
export const AdminCreateProductOption = z.object({
  title: z.string(),
  values: z.array(z.string()),
})

export type AdminUpdateProductOptionType = z.infer<
  typeof AdminUpdateProductOption
>
export const AdminUpdateProductOption = z.object({
  id: z.string().nullish(),
  title: z.string().nullish(),
  values: z.array(z.string()).nullish(),
})

// TODO: Add support for rules
export type AdminCreateVariantPriceType = z.infer<
  typeof AdminCreateVariantPrice
>
export const AdminCreateVariantPrice = z.object({
  currency_code: z.string(),
  amount: z.number(),
  min_quantity: z.number().nullish(),
  max_quantity: z.number().nullish(),
})

// TODO: Add support for rules
export type AdminUpdateVariantPriceType = z.infer<
  typeof AdminUpdateVariantPrice
>
export const AdminUpdateVariantPrice = z.object({
  id: z.string().nullish(),
  currency_code: z.string().nullish(),
  amount: z.number().nullish(),
  min_quantity: z.number().nullish(),
  max_quantity: z.number().nullish(),
})

export type AdminCreateProductTypeType = z.infer<typeof AdminCreateProductType>
export const AdminCreateProductType = z.object({
  value: z.string(),
})

export type AdminCreateProductVariantType = z.infer<
  typeof AdminCreateProductVariant
>
export const AdminCreateProductVariant = z
  .object({
    title: z.string(),
    sku: z.string().nullable().nullish(),
    ean: z.string().nullable().nullish(),
    upc: z.string().nullable().nullish(),
    barcode: z.string().nullable().nullish(),
    hs_code: z.string().nullable().nullish(),
    mid_code: z.string().nullable().nullish(),
    allow_backorder: z.boolean().nullish().default(false),
    manage_inventory: z.boolean().nullish().default(true),
    variant_rank: z.number().nullish(),
    weight: z.number().nullable().nullish(),
    length: z.number().nullable().nullish(),
    height: z.number().nullable().nullish(),
    width: z.number().nullable().nullish(),
    origin_country: z.string().nullable().nullish(),
    material: z.string().nullable().nullish(),
    metadata: z.record(z.unknown()).optional(),
    prices: z.array(AdminCreateVariantPrice),
    options: z.record(z.string()).nullish(),
    inventory_items: z
      .array(
        z.object({
          inventory_item_id: z.string(),
          required_quantity: z.number(),
        })
      )
      .nullish(),
  })
  .strict()

export type AdminUpdateProductVariantType = z.infer<
  typeof AdminUpdateProductVariant
>
export const AdminUpdateProductVariant = z
  .object({
    id: z.string().nullish(),
    title: z.string().nullish(),
    prices: z.array(AdminUpdateVariantPrice).nullish(),
    sku: z.string().nullable().nullish(),
    ean: z.string().nullable().nullish(),
    upc: z.string().nullable().nullish(),
    barcode: z.string().nullable().nullish(),
    hs_code: z.string().nullable().nullish(),
    mid_code: z.string().nullable().nullish(),
    allow_backorder: z.boolean().nullish(),
    manage_inventory: z.boolean().nullish(),
    variant_rank: z.number().nullish(),
    weight: z.number().nullable().nullish(),
    length: z.number().nullable().nullish(),
    height: z.number().nullable().nullish(),
    width: z.number().nullable().nullish(),
    origin_country: z.string().nullable().nullish(),
    material: z.string().nullable().nullish(),
    metadata: z.record(z.unknown()).optional(),
    options: z.record(z.string()).nullish(),
  })
  .strict()

export type AdminBatchUpdateProductVariantType = z.infer<
  typeof AdminBatchUpdateProductVariant
>
export const AdminBatchUpdateProductVariant = AdminUpdateProductVariant.extend({
  id: z.string(),
})

export const AdminCreateProductProductCategory = z.object({
  id: z.string(),
})

export type AdminCreateProductType = z.infer<typeof AdminCreateProduct>
export const AdminCreateProduct = z
  .object({
    title: z.string(),
    subtitle: z.string().nullable().nullish(),
    description: z.string().nullable().nullish(),
    is_giftcard: z.boolean().nullish().default(false),
    discountable: z.boolean().nullish().default(true),
    images: z.array(z.object({ url: z.string() })).nullish(),
    thumbnail: z.string().nullish(),
    handle: z.string().nullish(),
    status: statusEnum.nullish().default(ProductStatus.DRAFT),
    type_id: z.string().nullish(),
    collection_id: z.string().nullish(),
    categories: z.array(AdminCreateProductProductCategory).nullish(),
    tags: z.array(AdminUpdateProductTag).nullish(),
    options: z.array(AdminCreateProductOption).nullish(),
    variants: z.array(AdminCreateProductVariant).nullish(),
    sales_channels: z.array(z.object({ id: z.string() })).nullish(),
    weight: z.number().nullish(),
    length: z.number().nullish(),
    height: z.number().nullish(),
    width: z.number().nullish(),
    hs_code: z.string().nullish(),
    mid_code: z.string().nullish(),
    origin_country: z.string().nullish(),
    material: z.string().nullish(),
    metadata: z.record(z.unknown()).optional(),
  })
  .strict()

export type AdminUpdateProductType = z.infer<typeof AdminUpdateProduct>
export const AdminUpdateProduct = z
  .object({
    title: z.string().nullish(),
    discountable: z.boolean().nullish(),
    is_giftcard: z.boolean().nullish(),
    options: z.array(AdminUpdateProductOption).nullish(),
    variants: z.array(AdminUpdateProductVariant).nullish(),
    status: statusEnum.nullish(),
    subtitle: z.string().nullish(),
    description: z.string().nullish(),
    images: z.array(z.object({ url: z.string() })).nullish(),
    thumbnail: z.string().nullish(),
    handle: z.string().nullish(),
    type_id: z.string().nullish(),
    collection_id: z.string().nullish(),
    categories: z.array(AdminCreateProductProductCategory).nullish(),
    tags: z.array(AdminUpdateProductTag).nullable().nullish(),
    sales_channels: z.array(z.object({ id: z.string() })).nullish(),
    weight: z.number().nullish(),
    length: z.number().nullish(),
    height: z.number().nullish(),
    width: z.number().nullish(),
    hs_code: z.string().nullish(),
    mid_code: z.string().nullish(),
    origin_country: z.string().nullish(),
    material: z.string().nullish(),
    metadata: z.record(z.unknown()).optional(),
  })
  .strict()

export type AdminBatchUpdateProductType = z.infer<
  typeof AdminBatchUpdateProduct
>
export const AdminBatchUpdateProduct = AdminUpdateProduct.extend({
  id: z.string(),
})

// TODO: Handle in create and update product once ready
// @IsOptional()
// @Type(() => ProductProductCategoryReq)
// @ValidateNested({ each: true })
// @IsArray()
// categories?: ProductProductCategoryReq[]

export const AdminCreateVariantInventoryItem = z.object({
  required_quantity: z.number(),
  inventory_item_id: z.string(),
})
export type AdminCreateVariantInventoryItemType = z.infer<
  typeof AdminCreateVariantInventoryItem
>

export const AdminUpdateVariantInventoryItem = z.object({
  required_quantity: z.number(),
})
export type AdminUpdateVariantInventoryItemType = z.infer<
  typeof AdminUpdateVariantInventoryItem
>

export const AdminBatchCreateVariantInventoryItem = z
  .object({
    required_quantity: z.number(),
    inventory_item_id: z.string(),
    variant_id: z.string(),
  })
  .strict()
export type AdminBatchCreateVariantInventoryItemType = z.infer<
  typeof AdminBatchCreateVariantInventoryItem
>

export const AdminBatchUpdateVariantInventoryItem = z
  .object({
    required_quantity: z.number(),
    inventory_item_id: z.string(),
    variant_id: z.string(),
  })
  .strict()
export type AdminBatchUpdateVariantInventoryItemType = z.infer<
  typeof AdminBatchUpdateVariantInventoryItem
>

export const AdminBatchDeleteVariantInventoryItem = z
  .object({
    inventory_item_id: z.string(),
    variant_id: z.string(),
  })
  .strict()
export type AdminBatchDeleteVariantInventoryItemType = z.infer<
  typeof AdminBatchDeleteVariantInventoryItem
>

export type AdminBatchVariantInventoryItemsType = BatchMethodRequest<
  AdminBatchCreateVariantInventoryItemType,
  AdminBatchUpdateVariantInventoryItemType,
  AdminBatchDeleteVariantInventoryItemType
>
