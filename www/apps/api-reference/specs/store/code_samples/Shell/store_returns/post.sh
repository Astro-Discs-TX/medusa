curl -X POST '{backend_url}/store/returns' \
-H 'x-publishable-api-key: {your_publishable_api_key}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "order_id": "order_123",
  "items": []
}'