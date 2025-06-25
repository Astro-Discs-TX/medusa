/**
 * @oas [post] /admin/uploads/presigned-urls
 * operationId: PostUploadsPresignedUrls
 * summary: Create Upload
 * description: Create a upload.
 * x-authenticated: true
 * parameters:
 *   - name: with_deleted
 *     in: query
 *     description: Whether to include deleted records in the result.
 *     required: false
 *     schema:
 *       type: boolean
 *       title: with_deleted
 *       description: Whether to include deleted records in the result.
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminUploadPreSignedUrl"
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS SDK
 *     source: |-
 *       import Medusa from "@medusajs/js-sdk"
 * 
 *       export const sdk = new Medusa({
 *         baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
 *         debug: import.meta.env.DEV,
 *         auth: {
 *           type: "session",
 *         },
 *       })
 * 
 *       sdk.admin.upload.presignedUrl({
 *         name: "test.txt",
 *         size: 1000,
 *         type: "text/plain",
 *       }))
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/uploads/presigned-urls' \
 *       -H 'Authorization: Bearer {access_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "originalname": "{value}",
 *         "size": 43,
 *         "mime_type": "{value}"
 *       }'
 * tags:
 *   - Uploads
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminUploadPreSignedUrlResponse"
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
 * 
*/

