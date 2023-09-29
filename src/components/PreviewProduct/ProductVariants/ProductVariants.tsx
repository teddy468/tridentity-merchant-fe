import { formatPrice } from "../../../commons/utils/functions/formatPrice";
import { isIncludedSelectedVariant } from "../../../commons/utils/functions/product";
import styles from "./product-variants.module.scss";

interface ProductVariantsProps {
  attributes: ProductAttribute[];
  selectedVariants: SelectedVariant[];
  setSelectedVariant: (variant: SelectedVariant) => void;
}

const ProductVariants: React.FC<ProductVariantsProps> = ({
  attributes,
  selectedVariants,
  setSelectedVariant,
}: ProductVariantsProps) => {
  return (
    <div className={styles.wrapper}>
      {attributes.map(attribute => (
        <div className={styles.attribute} key={attribute.attribute_name}>
          <div className={styles.label}>
            {attribute.attribute_name} {attribute.is_required && <span className={styles.required}>*</span>}{" "}
            {!attribute.is_multiple_choice && <span>(Pick 1)</span>}
          </div>
          <div className={styles.variants}>
            {attribute.variants.map((variant: ProductVariation) => (
              <div
                className={[
                  styles.variant,
                  isIncludedSelectedVariant(
                    {
                      ...variant,
                      attribute_name: attribute.attribute_name,
                      is_required: attribute.is_required,
                      is_multiple_choice: attribute.is_multiple_choice,
                    },
                    selectedVariants
                  )
                    ? styles.active
                    : "",
                ].join(" ")}
                key={variant.attribute_value}
                onClick={() =>
                  setSelectedVariant({
                    ...variant,
                    attribute_name: attribute.attribute_name,
                    is_required: attribute.is_required,
                    is_multiple_choice: attribute.is_multiple_choice,
                  })
                }
              >
                {variant.attribute_value}{" "}
                <span className={styles.price}>{variant.price > 0 ? formatPrice(variant.price) : ""}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductVariants;
