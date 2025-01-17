/**
 * @oas [post] /admin/inventory-items/location-levels/batch
 * operationId: PostInventoryItemsLocationLevelsBatch
 * summary: Create Inventory Item
 * description: Create a inventory item.
 * x-authenticated: true
 * parameters: []
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: SUMMARY
 *         properties:
 *           create:
 *             type: array
 *             description: The inventory item's create.
 *             items:
 *               type: object
 *               description: The create's details.
 *               required:
 *                 - location_id
 *                 - inventory_item_id
 *               properties:
 *                 location_id:
 *                   type: string
 *                   title: location_id
 *                   description: The create's location id.
 *                 inventory_item_id:
 *                   type: string
 *                   title: inventory_item_id
 *                   description: The create's inventory item id.
 *                 stocked_quantity:
 *                   type: number
 *                   title: stocked_quantity
 *                   description: The create's stocked quantity.
 *                 incoming_quantity:
 *                   type: number
 *                   title: incoming_quantity
 *                   description: The create's incoming quantity.
 *           update:
 *             type: array
 *             description: The inventory item's update.
 *             items:
 *               type: object
 *               description: The update's details.
 *               required:
 *                 - location_id
 *                 - inventory_item_id
 *               properties:
 *                 location_id:
 *                   type: string
 *                   title: location_id
 *                   description: The update's location id.
 *                 inventory_item_id:
 *                   type: string
 *                   title: inventory_item_id
 *                   description: The update's inventory item id.
 *                 stocked_quantity:
 *                   type: number
 *                   title: stocked_quantity
 *                   description: The update's stocked quantity.
 *                 incoming_quantity:
 *                   type: number
 *                   title: incoming_quantity
 *                   description: The update's incoming quantity.
 *           delete:
 *             type: array
 *             description: The inventory item's delete.
 *             items:
 *               type: string
 *               title: delete
 *               description: The delete's details.
 *           force:
 *             type: boolean
 *             title: force
 *             description: The inventory item's force.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/inventory-items/location-levels/batch' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Inventory Items
 * responses:
 *   "200":
 *     description: OK
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 * x-workflow: batchInventoryItemLevelsWorkflow
 * 
*/

