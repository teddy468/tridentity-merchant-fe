declare interface Payment {
  amount: number;
  discount_amount: number;
  delivery_fee: number;
  loyalty_point: number;
  loyalty_discount_amount: number;
  campaign_loyalty_point: number;
  min_order: number;
}

declare interface OrderRef {
  id: number;
}

declare interface OrderItem {
  original_price: number;
  bundles: {
    attribute_name: string;
    attribute_value: string;
    price: number;
  }[];
  id: number;
  product_id: number;
  quantity: number;
  final_price: number;
  product: ProductName;
  campaign_loyalty_point: number;
}

declare interface ProductName {
  name: string;
  images: string[];
}

declare interface StoreInfo {
  merchant_id: number;
  merchant: { name: string; logo: string };
}

declare interface MerchantOrderResponse {
  id: string;
  create_time: string;
  note: string;
  merchant_store_id: number;
  status: number;
  orderRefer: OrderRef;
  items: OrderItem[];
  payment: Payment;
  store: StoreInfo;
  shipments?: Shipment[];
  transactions: Transaction[];
}

declare interface Transaction {
  amount: number;
  amount_breakdown: AmountBreakdown;
  id: number;
  merchant_store_id: number;
  payment_gateway: string;
  payment_method: number;
  reference_id: string;
  status: number;
  type: number;
}

declare interface AmountBreakdown {
  delivery_fee: number;
  discount_amount: number;
  item_amount: number;
  loyalty_discount_amount: number;
  net_amount: number;
  platform_fee: number;
  used_loyalty_point: number;
}

declare interface Shipment {
  id: number;
  address: string;
  data: ShipmentDataStop;
}

declare interface ShipmentDataStop {
  deliveryID: string;
  merchantOrderID: string;
  paymentMethod: string;
  pickupPin: string;
  recipient: {
    firstName: string;
    phone: string;
  };
}

declare interface MerchantOrderDetailResponse extends MerchantOrderResponse {
  histories?: OrderHistory[];
}

declare interface OrderHistory {
  create_time: string;
  status: number;
  event_name: string;
}

declare interface MerchantInfo {
  create_time: string;
  update_time: string;
  id: number;
  name: string;
  merchant_user_id: string;
  description: string;
  rating: number;
  reviews: number;
  likes: number;
  status: number;
  logo: string;
  banners: string[];
  settings: MerchantSetting;
}

interface MerchantMember {
  email: string;
  merchant_stores_ids: number[];
  phone: number;
  merchant_member_id: number;
  region?: string;
}
