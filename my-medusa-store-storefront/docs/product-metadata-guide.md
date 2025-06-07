# Product Metadata Guide for Marble Luxe

This guide explains how to set up product metadata in the Medusa Admin to properly display information in the product details tabs on the storefront.

## Overview

The storefront now dynamically loads product information from metadata fields. When you add specific metadata to your products or variants, this information will appear in the corresponding tabs on the product page.

## Available Metadata Fields

### Product-Level Metadata

These fields apply to the entire product:

| Metadata Key | Format | Description | Example |
|--------------|--------|-------------|---------|
| `materials` | JSON array or string | List of materials used in the product | `["Premium Italian marble", "Non-toxic sealant"]` |
| `features` | JSON array or string | List of product features | `["Handcrafted", "Waterproof", "Heat-resistant"]` |
| `shipping` | JSON array or string | Shipping information | `["Free shipping", "Delivery in 3-5 days"]` |
| `packaging` | String | Information about product packaging | "Premium gift box with certificate of authenticity" |
| `height` | Number or string | Product height in cm | "15" |
| `width` | Number or string | Product width in cm | "30" |
| `length` | Number or string | Product length in cm | "30" |
| `weight` | Number or string | Product weight in kg | "2.5" |

### Variant-Level Metadata

These fields can be added to specific variants to override the product-level dimensions:

| Metadata Key | Format | Description | Example |
|--------------|--------|-------------|---------|
| `height` | Number or string | Variant height in cm | "12" |
| `width` | Number or string | Variant width in cm | "25" |
| `length` | Number or string | Variant length in cm | "25" |
| `weight` | Number or string | Variant weight in kg | "1.8" |

## How to Add Metadata in Medusa Admin

1. **Navigate to Products**: Go to the Products section in your Medusa Admin
2. **Edit a Product**: Select the product you want to edit
3. **Add Metadata**:
   - Scroll down to the "Metadata" section
   - Click "Add Metadata"
   - Enter the key (e.g., "materials")
   - Enter the value (e.g., `["Premium Italian marble", "Non-toxic sealant"]` for JSON arrays)
   - Click "Add Metadata" to save

4. **For Variant-Specific Metadata**:
   - Go to the "Variants" section of the product
   - Select the variant you want to edit
   - Add metadata with the same keys as above

## Examples

### Example 1: Adding Materials

```json
{
  "key": "materials",
  "value": ["Italian Carrara Marble", "Brass accents", "Non-toxic sealant"]
}
```

### Example 2: Adding Variant Dimensions

```json
{
  "key": "height",
  "value": "15"
}
```

```json
{
  "key": "width",
  "value": "30"
}
```

### Example 3: Adding Shipping Information

```json
{
  "key": "shipping",
  "value": [
    "Free shipping on orders over $150",
    "White glove delivery available",
    "Ships within 3-5 business days",
    "International shipping available"
  ]
}
```

## Display Logic

The system will look for metadata in the following order:

1. Selected variant metadata (most specific)
2. Selected variant properties
3. Product metadata
4. Product properties
5. Default fallback values (least specific)

This means if a customer selects a specific variant (like "Small" size), they will see the dimensions for that specific variant if available.

## Troubleshooting

- **JSON Arrays**: When entering JSON arrays, make sure the format is correct with square brackets and quotes around string values
- **Missing Data**: If data doesn't appear, check that you've entered the correct metadata key
- **Refresh Issues**: You may need to clear your browser cache to see updated metadata values 