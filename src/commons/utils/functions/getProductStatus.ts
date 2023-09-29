import { ProductStatusEnum } from "../../constants/product";

export const getProductStatus = (status: ProductStatusEnum) => {
  switch (status) {
    case ProductStatusEnum.ACTIVE:
      return "Active";
    case ProductStatusEnum.INACTIVE:
      return "Inactive";
    case ProductStatusEnum.DRAFT:
      return "Draft";
    case ProductStatusEnum.BANNED:
      return "Banned";
    case ProductStatusEnum.PENDING_FOR_REVIEW:
      return "Pending for review";
    case ProductStatusEnum.REJECTED:
      return "Rejected";
    default:
      return "Unknown";
  }
};
