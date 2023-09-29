import { Modal, ModalProps } from "antd";
import { useEffect, useState } from "react";
import { SearchIcon } from "../../assets/icons";
import CustomInput from "../../commons/components/CustomInput/CustomInput";
import PrimaryButton from "../../commons/components/PrimaryButton/PrimaryButton";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedlnIcon,
  TrifoodLogo,
  NoAvatar,
  Notification,
  ShoppingCartIcon,
  SmsIcon,
  TwitterIcon,
} from "../../commons/resources";
import {
  getNormalAttributes,
  isIncludedSelectedVariant,
  isSelectedVariant,
} from "../../commons/utils/functions/product";
import styles from "./preview-product.module.scss";
import ProductDetailHeader from "./ProductDetailHeader/ProductDetailHeader";

export const FOOTER_ITEMS = ["Marketplace", "Privacy Policy", "Seller Center", "Terms of Service", "News & Events"];

export const socialMediaItems: ISocialMedia[] = [
  {
    name: "LinkedIn",
    link: "https://www.linkedin.com/",
    icon: <LinkedlnIcon />,
  },
  {
    name: "Facebook",
    link: "https://www.facebook.com/",
    icon: <FacebookIcon />,
  },
  {
    name: "Twitter",
    link: "https://twitter.com/",
    icon: <TwitterIcon />,
  },
  {
    name: "Instagram",
    link: "https://www.instagram.com/",
    icon: <InstagramIcon />,
  },
];
interface PreviewProductProps extends ModalProps {
  className?: string;
  product: CreateUpdateProductBody;
}
const PreviewProduct: React.FC<PreviewProductProps> = (props: PreviewProductProps) => {
  const { className, product, ...modalProps } = props;
  const { attributes, description, images, name, price, main_tags, sub_tags, merchant_store_id } = product;
  const [selectedVariants, setSelectedVariants] = useState<SelectedVariant[]>([]);

  const normalAttributes = getNormalAttributes(product);

  const handleSelectedVariants = (variant: SelectedVariant) => {
    if (variant.is_required) {
      if (!isIncludedSelectedVariant(variant, selectedVariants)) {
        const newSelectedVariants = selectedVariants.filter(
          selectedVariant => selectedVariant.attribute_name !== variant.attribute_name
        );
        setSelectedVariants([...newSelectedVariants, variant]);
      }
    } else {
      if (variant.is_multiple_choice) {
        if (isIncludedSelectedVariant(variant, selectedVariants)) {
          setSelectedVariants(selectedVariants.filter(selectedVariant => !isSelectedVariant(selectedVariant, variant)));
        } else {
          setSelectedVariants([...selectedVariants, variant]);
        }
      } else {
        if (!isIncludedSelectedVariant(variant, selectedVariants)) {
          const newSelectedVariants = selectedVariants.filter(
            selectedVariant => selectedVariant.attribute_name !== variant.attribute_name
          );
          setSelectedVariants([...newSelectedVariants, variant]);
        } else {
          setSelectedVariants(selectedVariants.filter(selectedVariant => !isSelectedVariant(selectedVariant, variant)));
        }
      }
    }
  };

  useEffect(() => {
    const requiredVariant: SelectedVariant[] = [];
    if (attributes?.length > 0) {
      attributes.forEach(attribute => {
        if (attribute.is_required) {
          let minPriceVariant = attribute.variants[0];
          attribute.variants.forEach(variant => {
            if (variant.price < minPriceVariant.price) {
              minPriceVariant = variant;
            }
          });
          requiredVariant.push({
            ...minPriceVariant,
            attribute_name: attribute.attribute_name,
            is_multiple_choice: attribute.is_multiple_choice,
            is_required: attribute.is_required,
          });
        }
      });
      setSelectedVariants(requiredVariant);
    }
  }, [attributes]);

  return (
    <Modal footer={<></>} className={[styles.previewProduct, className].join(" ")} {...modalProps}>
      <div className={styles.navigationBar}>
        <TrifoodLogo />
        <CustomInput
          className={styles.search}
          placeholder="Search for items, merchants, user..."
          prefix={<SearchIcon />}
        />
        <div className={styles.menu}>
          <div className={styles.menuItem}>Marketplace</div>
          <div className={styles.menuItem}>News & Events</div>
          <div className={styles.icon}>
            <Notification />
          </div>
          <div className={styles.icon}>
            <ShoppingCartIcon />
          </div>
        </div>
        <div className={styles.profile}>
          <img src={NoAvatar} alt="avatar" />
          <div>Username</div>
        </div>
      </div>
      <div className={styles.content}>
        <ProductDetailHeader
          main_tags={main_tags[0]}
          merchant_store_id={merchant_store_id}
          selectedVariants={selectedVariants}
          attributes={normalAttributes}
          setSelectedVariant={handleSelectedVariants}
          sub_tags={sub_tags}
          description={description}
          price={price}
          images={images}
          name={name}
        />
      </div>
      <div className={styles.footer}>
        <div className={styles.categories}>
          <div className={styles.socials}>
            <TrifoodLogo />
            <div className={styles.socialNetworks}>
              {socialMediaItems.map((socialMediaItem: ISocialMedia) => (
                <a href={socialMediaItem.link} target="_blank" rel="noreferrer" key={socialMediaItem.name}>
                  {socialMediaItem.icon}
                </a>
              ))}
            </div>
          </div>
          <div className={styles.items}>
            {FOOTER_ITEMS.map(item => (
              <div>{item}</div>
            ))}
          </div>
          <div className={styles.contact}>
            <div className={styles.title}>Subscribe to Our Newsletter</div>
            <div className={styles.form}>
              <CustomInput className={styles.email} placeholder="Your email address" prefix={<SmsIcon />} />{" "}
              <PrimaryButton className={styles.submitButton}>Submit</PrimaryButton>
            </div>
          </div>
        </div>
        <div className={styles.retangle}></div>
        <div className={styles.copyright}>© 2022 by Tridentity. All rights reserved</div>
      </div>
    </Modal>
  );
};

export default PreviewProduct;
