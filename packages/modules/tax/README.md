# Tax Module

## Enhanced Tax Features

### Compound Tax Calculation

In some tax systems (like Turkey's), taxes are calculated on top of other taxes. For example, VAT (KDV) is calculated on a price that already includes Special Consumption Tax (ÖTV). The `is_compound` flag enables this behavior.

When a tax rate is marked with `is_compound: true`:
- It will be calculated after non-compound taxes
- Its calculation will be based on the price plus all non-compound taxes
- This ensures proper tax-on-tax calculation for systems like Turkey's

#### Setting Up Compound Taxes

```js
// Create a tax region
const region = await taxModuleService.createTaxRegions({
  country_code: "tr",
});

// Create first non-compound tax (Special Consumption Tax)
const sctTaxRate = await taxModuleService.createTaxRates({
  tax_region_id: region.id,
  code: "SCT",
  name: "Special Consumption Tax",
  rate: 10, // 10%
  is_combinable: true, 
  is_compound: false, // Apply this tax to the base price
});

// Create a compound tax (VAT)
const vatTaxRate = await taxModuleService.createTaxRates({
  tax_region_id: region.id,
  code: "VAT",
  name: "Value Added Tax",
  rate: 18, // 18%
  is_combinable: true,
  is_compound: true, // Apply this tax to (price + SCT)
});
```

With this setup:
- A product costing 1000 TL will have:
  - 10% SCT = 100 TL (calculated on 1000 TL)
  - 18% VAT = 198 TL (calculated on 1100 TL)
  - Total tax = 298 TL
  - Final price = 1298 TL

#### Countries with Similar Compound Tax Systems

The compound tax feature supports various international tax systems similar to Turkey's model:

- **Brazil** - IPI (Industrial Product Tax) is applied first, then ICMS (state VAT) is calculated on the price including IPI
- **Philippines** - Excise taxes apply first, then VAT is calculated on the price including excise tax
- **Russia** - Excise duties apply first, then VAT is calculated on the price including these duties
- **India** - For luxury goods, additional cess tax applies on top of GST
- **Mexico** - IEPS (Special Tax) applies first to certain goods, then VAT is calculated on the price including IEPS
- **South Africa** - Excise duties on items like alcohol are applied first, then VAT is calculated on the price including duties

### Combinable Tax Rates Without Parent-Child Regions

The enhanced tax module now supports applying multiple tax rates within a single region without requiring parent-child region relationships.

#### Setting Up Combinable Tax Rates

```js
// Create a tax region
const region = await taxModuleService.createTaxRegions({
  country_code: "tr",
});

// Create a higher SCT rate for luxury goods
const luxurySctTaxRate = await taxModuleService.createTaxRates({
  tax_region_id: region.id,
  code: "LUX-SCT",
  name: "Luxury Special Consumption Tax",
  rate: 40, // 40% SCT for luxury goods
  is_combinable: true,
  is_compound: false,
});

// Create VAT as compound tax
const vatTaxRate = await taxModuleService.createTaxRates({
  tax_region_id: region.id,
  code: "VAT",
  name: "Value Added Tax",
  rate: 18, // 18% VAT
  is_combinable: true,
  is_compound: true, // Apply after SCT
});
```

With this setup:
- All works within a single region
