export enum STORE_SORTS {
  name = "name",
  createdAt = "createdAt",
}

export enum STORE_STATUS {
  CLOSED = 2, // closed
  LIVE = 1,
  SUSPENDED = 0, //off
}

export enum SERVICE_SUPPORTS {
  PICKUP = "pickup",
  DINE_IN = "dine in",
  DELIVERY = "delivery",
}

export const SERVICE_SUPPORT_OPTIONS = [
  { value: SERVICE_SUPPORTS.PICKUP, label: "Pick-up" },
  { value: SERVICE_SUPPORTS.DINE_IN, label: "Dine-in" },
  { value: SERVICE_SUPPORTS.DELIVERY, label: "Delivery" },
];

export const OPEN_24H_OPTIONS = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];

export const DAY_OFF_OPTIONS = [{ value: true, label: "OFF" }];
