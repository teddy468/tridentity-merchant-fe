export enum PRODUCT_SORTS {
  name = "name",
  createdAt = "createdAt",
}

export enum MAIN_TAG {
  hot = "hot",
  best_seller = "best_seller",
  new = "new",
}

export const MAIN_TAG_OPTIONS = [
  { value: MAIN_TAG.new, label: "New Dish" },
  { value: MAIN_TAG.hot, label: "Hot" },
  { value: MAIN_TAG.best_seller, label: "Best Seller" },
];

export enum SUB_TAG {
  special_on_today = "special_on_today",
  milk_tea = "milk_tea",
  juice = "juice",
  coffee = "coffee",
}

export const SUB_TAG_OPTIONS = [
  { value: SUB_TAG.special_on_today, label: "Special On Today" },
  {
    value: SUB_TAG.milk_tea,
    label: "Milk Tea",
  },
  {
    value: SUB_TAG.juice,
    label: "Juice",
  },
  {
    value: SUB_TAG.coffee,
    label: "Coffee",
  },
];

export enum PRODUCT_WARRANTY {
  INTERNATIONAL_WRRANTY = "International warranty",
}

export const PRODUCT_WARRANTY_OPTIONS = [
  { value: PRODUCT_WARRANTY.INTERNATIONAL_WRRANTY, label: "International warranty" },
];

export enum ProductStatusEnum {
  ACTIVE = 1,
  INACTIVE = 0,
  DRAFT = 2,
  BANNED = 3,
  PENDING_FOR_REVIEW = 4,
  REJECTED = 5,
}

export enum BadgeStatusEnum {
  INACTIVE = 0,
  ACTIVE = 1,
  DRAFT = 2,
}

export enum InventoryStatusEnum {
  IN_STOCK = 1,
  OUT_OF_STOCK = 0,
  RUN_OUT_SOON = 2,
}

export enum SelectDate {
  WEEK,
  MONTH,
  YEAR,
}

export const DEFAULT_PRODUCT_QUANTITY = 10000;

export enum TYPE_OF_ATTRIBUTE {
  is_required = "is_required",
  is_multiple_choice = "is_multiple_choice",
}

export const TYPE_OF_ATTRIBUTES_OPTIONS = [
  { value: TYPE_OF_ATTRIBUTE.is_required, label: "Required" },
  { value: TYPE_OF_ATTRIBUTE.is_multiple_choice, label: "Multiple-choice" },
];
