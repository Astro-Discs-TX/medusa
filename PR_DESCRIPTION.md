# Fix: Adding customer email for fulfillment providers

## The Problem

When shipping providers need to send tracking updates to customers, they need the customer's email address. Currently, when our system passes order information to fulfillment providers, the email address is missing, causing providers to fail or be unable to send notifications.

## What I Fixed

I updated both the regular fulfillment and return fulfillment processes to:

1. Check if an order is missing the customer's email
2. If missing, fetch the email from our database
3. Include the email in the data sent to shipping providers

This ensures providers can properly communicate with customers about their shipments.

## Testing

I added tests that verify:
- Regular fulfillment properly includes customer email
- Return fulfillment properly includes customer email

This fix is backward compatible and requires no changes from users.