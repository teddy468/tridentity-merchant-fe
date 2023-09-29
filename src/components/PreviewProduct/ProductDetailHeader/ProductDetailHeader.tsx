import { useEffect, useState } from "react";
import InputQuantity from "../../../commons/components/InputQuantity/InputQuantity";
import PrimaryButton from "../../../commons/components/PrimaryButton/PrimaryButton";
import { STORE_ADDRESS_URL } from "../../../commons/constants/api-urls";
import { MAIN_TAG_OPTIONS, SUB_TAG_OPTIONS } from "../../../commons/constants/product";
import useFetchList from "../../../commons/hooks/useFetchList";
import { OutlinedStarIcon } from "../../../commons/resources";
import { formatPrice } from "../../../commons/utils/functions/formatPrice";
import ProductVariants from "../ProductVariants/ProductVariants";
import styles from "./product-detail-header.module.scss";

interface ProductDetailHeaderProps {
  images: string[];
  name: string;
  price: number;
  description: string;
  sub_tags?: string[];
  attributes: ProductAttribute[];
  selectedVariants: SelectedVariant[];
  setSelectedVariant: (variant: SelectedVariant) => void;
  merchant_store_id: number;
  main_tags: string;
}
const ProductDetailHeader: React.FC<ProductDetailHeaderProps> = ({
  images,
  name,
  price,
  description,
  sub_tags,
  attributes,
  selectedVariants,
  setSelectedVariant,
  merchant_store_id,
  main_tags,
}: ProductDetailHeaderProps) => {
  const [currentImage, setCurrentImage] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { data: addresses } = useFetchList<MerchantStoreAddress>(
    merchant_store_id ? STORE_ADDRESS_URL(merchant_store_id) : "",
    {
      paginationMetadataStyle: "body",
      perPage: 2,
    }
  );

  useEffect(() => {
    const newPrice = selectedVariants.reduce((total, variant) => total + Number(variant.price), 0);
    setProductPrice(newPrice);
  }, [selectedVariants, price]);

  useEffect(() => {
    if (images.length > 0) {
      setCurrentImage(images[0]);
    }
  }, [images]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.imageWrapper}>
        <div className={styles.activeImage}>
          <img src={currentImage} alt="name" />
          <div className={styles.tag}>{MAIN_TAG_OPTIONS.find(tag => tag.value === main_tags)?.label}</div>
        </div>
        <div className={styles.smallImages}>
          {images.slice(0, 4).map((image, index) => (
            <img onClick={() => setCurrentImage(image)} src={image} key={index} alt="product" />
          ))}
        </div>
        <div className={styles.description}>
          <div className={styles.label}>Description</div>
          <div className={styles.content}>{description}</div>
        </div>
        <div className={styles.hashtagsWrapper}>
          <span className={styles.label}>Hashtags: </span>{" "}
          <span className={styles.hashtags}>
            {sub_tags?.map(tag => (
              <span>{SUB_TAG_OPTIONS.find(sub_tag => sub_tag.value === tag)?.label || ""}</span>
            ))}
          </span>
        </div>
      </div>
      <div className={styles.info}>
        <div className={styles.nameWrapper}>
          <div className={styles.productName}>{name}</div>
          <div className={styles.rating}>
            <div className={styles.star}>
              {new Array(5).fill(0).map((_, index) => (
                <OutlinedStarIcon key={index} />
              ))}
            </div>
            <div className={styles.review}>0 reviews</div>
          </div>
          <div className={styles.price}>{formatPrice(productPrice)}</div>
        </div>
        <div className={styles.deliveryInfo}>
          <div className={styles.label}>Delivered from</div>
          <div className={styles.addresses}>
            {addresses.map(item => (
              <div className={styles.address}>
                {item.address}, {item.district}, {item.city_or_province}, {item.country}
              </div>
            ))}
          </div>
        </div>
        <ProductVariants
          attributes={attributes}
          selectedVariants={selectedVariants}
          setSelectedVariant={setSelectedVariant}
        />
        <div className={styles.quantityWrapper}>
          <InputQuantity quantity={quantity} onChange={setQuantity} max={9999} />
          {new Intl.NumberFormat("en-US").format(9999)} available
        </div>
        <PrimaryButton>Add to cart</PrimaryButton>
      </div>
    </div>
  );
};

export default ProductDetailHeader;
