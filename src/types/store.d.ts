type STORE_SORTS = import("../commons/constants/store").STORE_SORTS;
type STORE_STATUS = import("../commons/constants/store").STORE_STATUS;
type SERVICE_SUPPORTS = import("../commons/constants/store").SERVICE_SUPPORTS;

declare interface Store {
  id: number;
  name: string;
  description: string;
  logo: string;
  banners: string[];
  is_restaurant: boolean;
  open_at: string;
  close_at: string;
  is_open_on_weekend: boolean;
  weekend_open_at: string;
  weekend_close_at: string;
  status: STORE_STATUS;
  service_supports: SERVICE_SUPPORTS[];
  status: number;
  create_time: string;
  update_time: string;
  merchant_id: number;
  min_order: number;
  outletContactPerson?: string;
  openingHoursMon: string;
  openingHoursTue: string;
  openingHoursWed: string;
  openingHoursThu: string;
  openingHoursFri: string;
  openingHoursSat: string;
  openingHoursSun: string;
  closingHoursMon: string;
  closingHoursTue: string;
  closingHoursWed: string;
  closingHoursThu: string;
  closingHoursFri: string;
  closingHoursSat: string;
  closingHoursSun: string;
  isOpen24Hours: boolean;
  halalCertified: boolean;
  muslimOwned: boolean;
  triFoodPOSes: {
    id: number;
    POSId: string;
  }[];
  categoriesLevel1: Category[];
  categoriesLevel2: Category[];
  categoriesLevel3: Category[];
  hours_until_auto_complete: number;
  merchantStoreApproval?: Store[];
}

declare interface ReportOrderList {
  id: string;
  merchant_store_id: number;
  order_date: string;
  status: number;
  subtotal: number;
  platform_fee: number;
  delivery_fee: number;
  discount_amount: number;
  used_loyalty_point: number;
  loyalty_discount_amount: number;
  item_amount: number;
  net_amount: number;
}

declare interface TotalInfo {
  total_order: number;
  total_received_lp: number;
  total_revenue: number;
}

declare interface BestSellerData {
  id: number;
  name: string;
  revenue: number;
  total_sold: number;
}

declare interface GetStoresResponse extends Pagination<Store> {}

declare interface CreateUpdateStoreValues {
  name: string;
  description: string;
  logo: string;
  banners: string[];
  is_restaurant: boolean;
  open_at?: Dayjs;
  close_at?: Dayjs;
  is_open_on_weekend: boolean;
  weekend_open_at: string;
  weekend_close_at: string;
  service_supports: SERVICE_SUPPORTS[];
  min_order: number | null;
  address: string;
  country: string | undefined;
  district: string;
  city_or_province: string;
  postal_code: string;
  phone: string;
  coordinate: StoreAddress["coordinate"];
  location_type: string;
  isOpen24Hours: boolean;
  outletContactPerson?: string;
  halalCertified: boolean;
  muslimOwned: boolean;
  openingHoursMon?: Dayjs;
  openingHoursTue?: Dayjs;
  openingHoursWed?: Dayjs;
  openingHoursThu?: Dayjs;
  openingHoursFri?: Dayjs;
  openingHoursSat?: Dayjs;
  openingHoursSun?: Dayjs;
  closingHoursMon?: Dayjs;
  closingHoursTue?: Dayjs;
  closingHoursWed?: Dayjs;
  closingHoursThu?: Dayjs;
  closingHoursFri?: Dayjs;
  closingHoursSat?: Dayjs;
  closingHoursSun?: Dayjs;
  categoryLevel1Ids: number[];
  categoryLevel2Ids: number[];
  categoryLevel3Ids: number[];
  hours_until_auto_complete: number | null;
}
declare interface CreateUpdateStoreBody {
  name: string;
  description: string;
  logo: string;
  banners: string[];
  is_restaurant: boolean;
  open_at: string;
  close_at: string;
  is_open_on_weekend: boolean;
  weekend_open_at: string;
  weekend_close_at: string;
  status: STORE_STATUS;
  service_supports: SERVICE_SUPPORTS[];
  min_order: number;
  isOpen24Hours: boolean;
  outletName?: string;
  outletAddress?: string;
  outletContactPerson?: string;
  halalCertified: boolean;
  muslimOwned: boolean;
  openingHoursMon?: string;
  openingHoursTue?: string;
  openingHoursWed?: string;
  openingHoursThu?: string;
  openingHoursFri?: string;
  openingHoursSat?: string;
  openingHoursSun?: string;
  closingHoursMon?: string;
  closingHoursTue?: string;
  closingHoursWed?: string;
  closingHoursThu?: string;
  closingHoursFri?: string;
  closingHoursSat?: string;
  closingHoursSun?: string;
  categoryLevel1Ids: number[];
  categoryLevel2Ids: number[];
  categoryLevel3Ids: number[];
  hours_until_auto_complete: number;
}

declare interface CreateUpdateStoreResponse extends Store {}

declare interface StoreAddress {
  service_supports: SERVICE_SUPPORTS[];
  id: number;
  merchant_store_id: number;
  address: string;
  description: string;
  phone: string;
  coordinate: {
    lat: string;
    lng: string;
  };
  status: number;
  country: string;
  district: string;
  city_or_province: string;
  postal_code: string;
  phone: string;
  location_type: string;
}

declare interface CreateUpdateStoreAddressBody {
  address: string;
  description: string;
  service_supports: SERVICE_SUPPORTS[];
  coordinate: {
    lat: string;
    lng: string;
  };
  country: string;
  district: string;
  city_or_province: string;
  postal_code: string;
  phone: string;
  location_type: string;
}
declare interface CreateUpdateStoreAddressResponse {
  address: string;
  description: string;
  service_supports: SERVICE_SUPPORTS[];
  coordinate: {
    lat: string;
    lng: string;
  };
  country: string;
  district: string;
  city_or_province: string;
  postal_code: string;
  phone: string;
}

declare interface MerchantStoreAddress {
  id: number;
  merchant_store_id: number;
  address: string;
  description: string;
  phone: string;
  coordinate: {
    lat: string;
    lng: string;
  };
  status: number;
  country: string;
  district: string;
  city_or_province: string;
  postal_code: string;
  phone: string;
}
