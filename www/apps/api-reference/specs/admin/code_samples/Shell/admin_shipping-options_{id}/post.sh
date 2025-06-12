curl -X POST '{backend_url}/admin/shipping-options/{id}' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "name": "Express Shipping",
  "metadata": {
    "priority": "high",
    "tracking": "enabled"
  }
}'