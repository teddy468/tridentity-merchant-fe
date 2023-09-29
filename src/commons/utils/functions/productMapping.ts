import { DEFAULT_PRODUCT_QUANTITY, MAIN_TAG, ProductStatusEnum, TYPE_OF_ATTRIBUTE } from "../../constants/product";
import { getNormalAttributes, getVariantDefault } from "./product";

export const getAttributesValueFromProductDetail = (
  product?: Product | null,
  defaultAttributes: Attribute[] = []
): { price?: string; quantity?: string; attributes: any } => {
  if (!product) {
    return {
      price: "",

      attributes: defaultAttributes.map(item => ({
        ...item,
        attribute_name: item.name,
        variants: [{ attribute_value: "", price: "" }],
        type_of_attribute: item.is_required
          ? TYPE_OF_ATTRIBUTE.is_required
          : item.is_multiple_choice
          ? TYPE_OF_ATTRIBUTE.is_multiple_choice
          : "",
      })),
    };
  }
  const defaultVariant = getVariantDefault(product);
  const attributes = getNormalAttributes(product);

  return {
    price: defaultVariant?.price.toString(),

    attributes: attributes.map(attribute => ({
      ...attribute,
      type_of_attribute: attribute.is_required
        ? TYPE_OF_ATTRIBUTE.is_required
        : attribute.is_multiple_choice
        ? TYPE_OF_ATTRIBUTE.is_multiple_choice
        : "",
    })),
  };
};

export const getValuesFromProductDetail = (
  product?: Product | null,
  merchantStoreId?: number | string,
  defaultAttributes?: Attribute[]
): CreateUpdateProductValues => {
  defaultAttributes?.sort((a, b) => a.id - b.id);

  const { price, attributes } = getAttributesValueFromProductDetail(product, product?.id ? [] : defaultAttributes);

  return {
    merchant_store_id: merchantStoreId?.toString() || product?.merchant_store_id?.toString() || "",
    price: price || "",
    category_id: product?.category_id?.toString() || "",
    name: product?.name || "",
    description: product?.description || "",
    thumbnail: product?.thumbnail || "",
    attributes: attributes,
    images: product?.images || [],
    videos: product?.videos || [],
    brand: product?.brand || "",
    manufacturer: product?.manufacturer || "",
    manufacturer_address: product?.manufacturer_address || "",
    product_warranty: (product?.warranty as PRODUCT_WARRANTY) || "",
    warranty: product?.warranty || "",
    shipment_weight: product?.shipment_weight?.toString() || "",
    width: product?.width?.toString() || "",
    height: product?.height?.toString() || "",
    depth: product?.depth?.toString() || "",
    condition: product?.condition?.toString() || "",
    day_to_prepare_order: product?.day_to_prepare_order?.toString() || "",
    lead_time: product?.lead_time?.toString() || "",
    sku: product?.sku || "",
    status: product?.status?.toString() || "",
    settings: {
      is_featured: true,
    },
    main_tags: !!product?.main_tags?.length ? product?.main_tags[0] : MAIN_TAG.new,
    sub_tags: product?.sub_tags || [],
  };
};

export const getBodyAttributesFromValues = (values: CreateUpdateProductValues): ProductAttribute[] => {
  const attributes: ProductAttribute[] = values.attributes.map(item => ({
    ...item,
    is_required: !!item.type_of_attribute?.includes(TYPE_OF_ATTRIBUTE.is_required),
    is_multiple_choice: !!item.type_of_attribute?.includes(TYPE_OF_ATTRIBUTE.is_multiple_choice),
    variants: item.variants.map(variant => ({
      ...variant,
      price: Number(variant.price),
    })),
  }));
  const requiredAttribute = attributes.find(item => item.is_required);
  const defaultAttribute = [
    {
      attribute_name: "default",
      is_required: true,
      is_multiple_choice: false,
      variants: [{ attribute_value: "default", price: Number(values.price) }],
    },
  ];
  return [...attributes, ...(requiredAttribute ? [] : defaultAttribute)];
};

export const getBodyAttributesFromValuesTypeRadioBox = (values: CreateUpdateProductValues): ProductAttribute[] => {
  const attributes: ProductAttribute[] = values.attributes.map(item => ({
    ...item,
    is_required: !!item.type_of_attribute?.includes(TYPE_OF_ATTRIBUTE.is_required),
    is_multiple_choice: !!item.type_of_attribute?.includes(TYPE_OF_ATTRIBUTE.is_multiple_choice),
    variants: item.variants.map(variant => ({
      ...variant,
      price: Number(variant.price),
    })),
    type_of_attribute: [item.type_of_attribute],
  }));
  const requiredAttribute = attributes.find(item => item.is_required);
  const defaultAttribute = [
    {
      attribute_name: "default",
      is_required: true,
      is_multiple_choice: false,
      variants: [{ attribute_value: "default", price: Number(values.price) }],
    },
  ];
  return [...attributes, ...(requiredAttribute ? [] : defaultAttribute)];
};

export const getBodyFromProductValues = (
  values: CreateUpdateProductValues,
  merchantStoreId?: number | string
): CreateUpdateProductBody => {
  return {
    merchant_store_id: Number(merchantStoreId || values.merchant_store_id),
    price: Number(values.price),
    category_id: Number(values.category_id),
    name: values.name || "",
    description: values.description || "",
    attributes: getBodyAttributesFromValuesTypeRadioBox(values),
    images: values.images || [],
    videos: values.videos || [],
    thumbnail: values.images?.[0],
    brand: values.brand || "",
    manufacturer: values.manufacturer || "",
    manufacturer_address: values.manufacturer_address || "",
    product_warranty: (values.warranty as PRODUCT_WARRANTY) || "",
    warranty: values.warranty || "",
    shipment_weight: Number(values.shipment_weight),
    width: Number(values.width),
    height: Number(values.height),
    depth: Number(values.depth),
    condition: 1,
    day_to_prepare_order: Number(values.day_to_prepare_order) || 1,
    lead_time: Number(values.lead_time),
    sku: values.sku,
    status: Number(values.status),
    settings: {
      is_featured: true,
    },
    main_tags: [values.main_tags],
    sub_tags: values.sub_tags,
  };
};

export const getProductCountByStatus = (
  productCounts: { status: number; count: number }[],
  status: ProductStatusEnum
) => {
  const productCount = productCounts.find(item => item.status === status);
  return productCount?.count || 0;
};

export const createNewAttribute = (): ProductAttributeValues => ({
  attribute_name: "",
  type_of_attribute: TYPE_OF_ATTRIBUTE.is_required,
  variants: [
    {
      attribute_value: "",
      price: "",
    },
  ],
});
