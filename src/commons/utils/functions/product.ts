export const isIncludedSelectedVariant = (variant: SelectedVariant, selectedVariants: SelectedVariant[]) => {
  return (
    selectedVariants.findIndex(
      selectedVariant =>
        selectedVariant.attribute_name === variant.attribute_name &&
        selectedVariant.attribute_value === variant.attribute_value
    ) !== -1
  );
};

export const isSelectedVariant = (variant: SelectedVariant, selectedVariant: SelectedVariant) => {
  return (
    selectedVariant.attribute_name === variant.attribute_name &&
    selectedVariant.attribute_value === variant.attribute_value
  );
};

export const isVariantDefault = (attribute: ProductAttribute): boolean => {
  return !!(
    attribute.attribute_name === "default" &&
    attribute.is_required &&
    attribute.variants.length === 1 &&
    attribute.variants[0]?.attribute_value === "default"
  );
};

export const getVariantDefault = (product: Product): ProductVariation | undefined => {
  return product.attributes.find(attribute => isVariantDefault(attribute))?.variants[0];
};

export const getNormalAttributes = ({ attributes }: { attributes: Product["attributes"] }): ProductAttribute[] => {
  return attributes.filter(attribute => !isVariantDefault(attribute));
};
