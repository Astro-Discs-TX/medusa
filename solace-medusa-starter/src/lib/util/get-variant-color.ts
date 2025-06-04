import { VariantColor } from 'types/strapi'

export const getVariantColor = (
  variantName: string,
  colors: VariantColor[] | null | undefined
) => {
  // Safely handle null or undefined colors array
  if (!colors || !Array.isArray(colors)) {
    return null
  }
  
  const color = colors.find((c) => c.Name === variantName)

  return color?.Type?.[0]
}
