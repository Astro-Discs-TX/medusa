curl -X POST '{backend_url}/admin/products/imports' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "file_key": "{value}",
  "originalname": "{value}",
  "extension": "{value}",
  "size": 23,
  "mime_type": "{value}"
}'