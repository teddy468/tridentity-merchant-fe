type PRODUCT_SORTS = import("../commons/constants/product").PRODUCT_SORTS;
type MAIN_TAG = import("../commons/constants/product").MAIN_TAG;
type SUB_TAG = import("../commons/constants/product").SUB_TAG;
type PRODUCT_WARRANTY = import("../commons/constants/product").PRODUCT_WARRANTY;
type TYPE_OF_ATTRIBUTE = import("../commons/constants/product").TYPE_OF_ATTRIBUTE;

declare interface ProductVariation {
  attribute_value: string;
  price: number;
  is_deleted?: boolean;
}

declare type ProductAttribute = {
  attribute_name: string;
  is_required: boolean;
  is_multiple_choice: boolean;
  variants: ProductVariation[];
};

declare interface Product {
  id: number;
  merchant_store_id: number;
  category_id: number;
  name: string;
  price?: number;
  description: string;
  thumbnail: string;
  attributes: ProductAttribute[];
  images: string[];
  videos: string[];
  brand?: string;
  total_sales?: number;
  manufacturer: string;
  manufacturer_address: string;
  warranty: string;
  product_warranty?: string;
  shipment_weight: number;
  width: number;
  height: number;
  depth: number;
  condition: number;
  day_to_prepare_order: number;
  lead_time: number;
  sku: string;
  status: number;
  settings?: {
    is_featured: boolean;
  };
  main_tags: MAIN_TAG[];
  sub_tags: SUB_TAG[];
  is_sold_out: boolean;
}

declare interface ProductVariationValues extends ProductVariation {
  price: number | string;
}

declare interface ProductAttributeValues extends Omit<ProductAttribute, "is_required" | "is_multiple_choice"> {
  variants: ProductVariationValues[];
  type_of_attribute: TYPE_OF_ATTRIBUTE;
}

declare interface CreateUpdateProductValues {
  id?: number;
  merchant_store_id: string;
  price: string;
  category_id: string;
  name: string;
  description: string;
  thumbnail: string;
  attributes: ProductAttributeValues[];
  images: string[];
  videos: string[];
  brand?: string;
  manufacturer: string;
  manufacturer_address: string;
  warranty: string;
  product_warranty: PRODUCT_WARRANTY;
  shipment_weight: string;
  width: string;
  height: string;
  depth: string;
  condition: string;
  day_to_prepare_order: string;
  lead_time: string;
  sku: string;
  status: string;
  settings?: {
    is_featured: boolean;
  };
  main_tags: MAIN_TAG;
  sub_tags: SUB_TAG[];
}

declare interface CreateUpdateProductBody {
  merchant_store_id: number;
  price: number;
  category_id: number;
  name: string;
  description: string;
  thumbnail: string;
  attributes: ProductAttribute[];
  images: string[];
  videos: string[];
  brand?: string;
  manufacturer: string;
  manufacturer_address: string;
  warranty: string;
  product_warranty: PRODUCT_WARRANTY;
  shipment_weight: number;
  width: number;
  height: number;
  depth: number;
  condition: number;
  day_to_prepare_order: number;
  lead_time: number;
  sku: string;
  status: number;
  settings?: {
    is_featured: boolean;
  };
  main_tags: MAIN_TAG[];
  sub_tags: SUB_TAG[];
}

declare interface CreateUpdateProductResponse extends Product {}

declare interface ProductItem {
  id: number;
  name: string;
  price: number;
  slug: string;
  images: string[];
  rating: number;
  reviews: number;
  total_sales: number;
  store: Store;
  settings: {
    [key: string]: any;
  };
}

declare interface SelectedVariant {
  attribute_name: string;
  attribute_value: string;
  price: number;
  is_required: boolean;
  is_multiple_choice: boolean;
}

declare interface Attribute extends Omit<ProductAttribute, "attribute_name" | "variants"> {
  id: number;
  name: string;
}

declare interface SettlementItem {
  create_time: string;
  id: number;
  merchant_store_id: number;
  actual_transaction_date?: string;
  last_transaction_date: string;
  expected_transaction_date: string;

  amount_breakdown: {
    LP_SPENT?: number;
    LP_AMOUNT: number;
    NET_AMOUNT: number;
    ITEM_AMOUNT: number;
    TOTAL_ORDER: number;
    DELIVERY_FEE: number;
    PLATFORM_FEE: number;
    DISCOUNT_AMOUNT: number;
    LP_DISCOUNT_AMOUNT: number;
  };
  histories: [{ time: string; status: number }];
  status: number;
}

declare interface LoyaltyPointMerchant {
  balance: number;
}

declare interface SettlementOrder {
  create_time: time;
  id: number;
  merchant_store_id: number;
  store: {
    name: string;
  };
  transactions: SettlementOrderTrans[];
  histories: { create_time: string; order_id: string; status: number }[];
  status: number;
}

declare interface SettlementOrderTrans {
  amount_breakdown: {
    platform_fee: number;
    used_loyalty_point: number;
    net_amount: number;
    delivery_fee: number;
  };
}

declare interface SettlementGeneralInfo {
  total_order: string;
  platform_fee: string;
  used_loyalty_point: string;
  net_amount: string;
  delivery_fee: string;
  lp_spent: number;
}
