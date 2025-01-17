/**
 * @schema AdminProductVariantInventoryItemLink
 * type: object
 * description: The inventory item's inventory items.
 * x-schemaName: AdminProductVariantInventoryItemLink
 * required:
 *   - id
 *   - variant_id
 *   - inventory_item_id
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The inventory item's ID.
 *   variant_id:
 *     type: string
 *     title: variant_id
 *     description: The inventory item's variant id.
 *   variant:
 *     $ref: "#/components/schemas/AdminProductVariant"
 *   inventory_item_id:
 *     type: string
 *     title: inventory_item_id
 *     description: The inventory item's inventory item id.
 *   inventory:
 *     $ref: "#/components/schemas/AdminInventoryItem"
 * 
*/

