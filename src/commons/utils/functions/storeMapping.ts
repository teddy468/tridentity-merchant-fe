import dayjs from "dayjs";
import { trim } from "lodash";
const CODE_SINGAPORE = "+65";
const CODE_SINGAPORE_OPEN = "+650";
const handlePhoneNumber = (phone: string) => {
  const prefixLocation = phone.includes(CODE_SINGAPORE);
  if (prefixLocation) {
    if (phone.includes(CODE_SINGAPORE_OPEN)) {
      return phone.replace(CODE_SINGAPORE_OPEN, "");
    } else {
      return phone.replace(CODE_SINGAPORE, "");
    }
  } else {
    return phone;
  }
};

export const getValuesFromStoreDetail = (store?: Store | null, address?: StoreAddress): CreateUpdateStoreValues => {
  const value = {
    status: store?.status ?? 0,
    name: trim(store?.name) ?? "",
    description: trim(store?.description) ?? "",
    logo: store?.logo ?? "",
    banners: store?.banners?.length ? store?.banners : [],
    is_restaurant: store?.is_restaurant ?? true,
    open_at: store?.open_at ? dayjs(store?.open_at, "HH:mm") : undefined,
    close_at: store?.close_at ? dayjs(store?.close_at, "HH:mm") : undefined,
    is_open_on_weekend: store?.is_open_on_weekend ?? false,
    weekend_open_at: store?.weekend_open_at ?? "",
    weekend_close_at: store?.weekend_close_at ?? "",
    service_supports: store?.service_supports || [],
    address: trim(address?.address) || "",
    country: address?.country || undefined,
    district: address?.district || "",
    city_or_province: address?.city_or_province || "",
    postal_code: address?.postal_code || "",
    phone: address?.phone ? handlePhoneNumber(address?.phone) : "",
    coordinate: { lat: address?.coordinate?.lat.toString() || "", lng: address?.coordinate.lng?.toString() || "" },
    min_order: store?.min_order || null,
    location_type: address?.location_type || "",
    isOpen24Hours: store?.isOpen24Hours || false,
    outletContactPerson: store?.outletContactPerson || undefined,
    halalCertified: store?.halalCertified || false,
    muslimOwned: store?.muslimOwned || false,
    openingHoursMon: store?.openingHoursMon ? dayjs(store?.openingHoursMon, "HH:mm") : undefined,
    openingHoursTue: store?.openingHoursTue ? dayjs(store?.openingHoursTue, "HH:mm") : undefined,
    openingHoursWed: store?.openingHoursWed ? dayjs(store?.openingHoursWed, "HH:mm") : undefined,
    openingHoursThu: store?.openingHoursThu ? dayjs(store?.openingHoursThu, "HH:mm") : undefined,
    openingHoursFri: store?.openingHoursFri ? dayjs(store?.openingHoursFri, "HH:mm") : undefined,
    openingHoursSat: store?.openingHoursSat ? dayjs(store?.openingHoursSat, "HH:mm") : undefined,
    openingHoursSun: store?.openingHoursSun ? dayjs(store?.openingHoursSun, "HH:mm") : undefined,
    closingHoursMon: store?.closingHoursMon ? dayjs(store?.closingHoursMon, "HH:mm") : undefined,
    closingHoursTue: store?.closingHoursTue ? dayjs(store?.closingHoursTue, "HH:mm") : undefined,
    closingHoursWed: store?.closingHoursWed ? dayjs(store?.closingHoursWed, "HH:mm") : undefined,
    closingHoursThu: store?.closingHoursThu ? dayjs(store?.closingHoursThu, "HH:mm") : undefined,
    closingHoursFri: store?.closingHoursFri ? dayjs(store?.closingHoursFri, "HH:mm") : undefined,
    closingHoursSat: store?.closingHoursSat ? dayjs(store?.closingHoursSat, "HH:mm") : undefined,
    closingHoursSun: store?.closingHoursSun ? dayjs(store?.closingHoursSun, "HH:mm") : undefined,
    categoryLevel1Ids: store?.categoriesLevel1 ? store?.categoriesLevel1?.map((item: Category) => item.id) : [],
    categoryLevel2Ids: store?.categoriesLevel2 ? store?.categoriesLevel2?.map((item: Category) => item.id) : [],
    categoryLevel3Ids: store?.categoriesLevel3 ? store?.categoriesLevel3?.map((item: Category) => item.id) : [],
    hours_until_auto_complete: store?.hours_until_auto_complete || null,
  };
  return value;
};

export const getBodyFromStoreValues = (values: CreateUpdateStoreValues): CreateUpdateStoreBody => {
  return {
    name: values.name,
    description: values.description,
    logo: values.logo,
    banners: values.banners,
    is_restaurant: values.is_restaurant ?? true,
    open_at: values.open_at?.format("HH:mm") || "",
    close_at: values.close_at?.format("HH:mm") || "",
    is_open_on_weekend: values.is_open_on_weekend ?? false,
    weekend_open_at: values.weekend_open_at,
    weekend_close_at: values.weekend_close_at || "",
    service_supports: values.service_supports,
    status: 1,
    min_order: Number(values.min_order),
    isOpen24Hours: values.isOpen24Hours,
    outletContactPerson: values?.outletContactPerson || undefined,
    halalCertified: values.halalCertified,
    muslimOwned: values.muslimOwned,
    openingHoursMon: values.openingHoursMon?.format("HH:mm") || undefined,
    openingHoursTue: values.openingHoursTue?.format("HH:mm") || undefined,
    openingHoursWed: values.openingHoursWed?.format("HH:mm") || undefined,
    openingHoursThu: values.openingHoursThu?.format("HH:mm") || undefined,
    openingHoursFri: values.openingHoursFri?.format("HH:mm") || undefined,
    openingHoursSat: values.openingHoursSat?.format("HH:mm") || undefined,
    openingHoursSun: values.openingHoursSun?.format("HH:mm") || undefined,
    closingHoursMon: values.closingHoursMon?.format("HH:mm") || undefined,
    closingHoursTue: values.closingHoursTue?.format("HH:mm") || undefined,
    closingHoursWed: values.closingHoursWed?.format("HH:mm") || undefined,
    closingHoursThu: values.closingHoursThu?.format("HH:mm") || undefined,
    closingHoursFri: values.closingHoursFri?.format("HH:mm") || undefined,
    closingHoursSat: values.closingHoursSat?.format("HH:mm") || undefined,
    closingHoursSun: values.closingHoursSun?.format("HH:mm") || undefined,
    categoryLevel1Ids: values.categoryLevel1Ids ? values.categoryLevel1Ids : [],
    categoryLevel2Ids: values.categoryLevel2Ids ? values.categoryLevel2Ids : [],
    categoryLevel3Ids: values.categoryLevel3Ids ? values.categoryLevel3Ids : [],
    hours_until_auto_complete: Number(values.hours_until_auto_complete),
  };
};

export const getAddressFromStoreValues = (values: CreateUpdateStoreValues): CreateUpdateStoreAddressBody => {
  return {
    address: values.address,
    service_supports: values.service_supports,
    description: "",
    coordinate: values.coordinate,
    country: values?.country || "",
    district: values?.district || "",
    city_or_province: values?.city_or_province || "",
    postal_code: values?.postal_code || "",
    phone: `${CODE_SINGAPORE}${values.phone[0] === "0" ? values.phone.replace("0", "") : values.phone}`,
    location_type: values.location_type,
  };
};
