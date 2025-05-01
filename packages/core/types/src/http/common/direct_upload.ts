/**
 * Response sent by the "admin/direct_upload" endpoint.
 */
export interface AdminDirectUploadSignatureResponse {
  /**
   * The URL to be used for uploading the file
   */
  url: string

  /**
   * The unique filename that can be used with the file provider
   * to fetch the file
   */
  filename: string

  /**
   * The original name of the file on the user's computer (aka clientName)
   */
  originalname: string

  /**
   * The mime type of the file.
   */
  mimeType: string

  /**
   * Extension of the file to be uploaded
   */
  extension: string

  /**
   * Size of the file to be uploaded (in bytes)
   */
  size: number
}
