/**
 * @oas [post] /admin/products/imports/{transaction_id}/confirm
 * operationId: PostProductsImportsTransaction_idConfirm
 * summary: Add Confirm to Product
 * description: Add a Confirm to a product
 * x-authenticated: true
 * parameters:
 *   - name: transaction_id
 *     in: path
 *     description: The product's transaction id.
 *     required: true
 *     schema:
 *       type: string
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/products/imports/{transaction_id}/confirm' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Products
 * responses:
 *   "202":
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
 * x-version: 2.8.5
 * 
*/

