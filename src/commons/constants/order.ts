export enum ORDER_STATUS {
  PENDING = 0,
  CONFIRMED = 1,
  DELIVERING = 2,
  DELIVERED = 3,
  CANCELLED = 4,
  REFUNDING = 5,
  REFUNDED = 6,
  SUCCEEDED = 7,
  SETTLED = 8,
  WAITING_FOR_PAYMENT = 9,
  REJECTED = 10,
  EXPIRED = 11,
  ON_GOING = 12,
  COMPLETED = 13,
  USER_PICKED_UP = 14,
  PREPARED = 15,
  PAID = 16,
  REFUND_REJECTED = 17
}

export const getOrderStatus = (status: number) => {
  if (status === ORDER_STATUS.PENDING) {
    return "Pending";
  } else if (status === ORDER_STATUS.CONFIRMED) {
    return "Confirmed";
  } else if (status === ORDER_STATUS.DELIVERING) {
    return "Delivering";
  } else if (status === ORDER_STATUS.DELIVERED) {
    return "Delivered";
  } else if (status === ORDER_STATUS.CANCELLED) {
    return "Cancelled";
  } else if (status === ORDER_STATUS.REFUNDING) {
    return "Refunding";
  } else if (status === ORDER_STATUS.REFUNDED) {
    return "Refunded";
  } else if (status === ORDER_STATUS.SUCCEEDED) {
    return "Succeeded";
  } else if (status === ORDER_STATUS.SETTLED) {
    return "Settled";
  } else if (status === ORDER_STATUS.WAITING_FOR_PAYMENT) {
    return "Waiting for payment";
  } else if (status === ORDER_STATUS.REFUNDED) {
    return "Refunded";
  } else if (status === ORDER_STATUS.EXPIRED) {
    return "Expired";
  } else if (status === ORDER_STATUS.ON_GOING) {
    return "On going";
  } else if (status === ORDER_STATUS.COMPLETED) {
    return "Completed";
  } else if (status === ORDER_STATUS.USER_PICKED_UP) {
    return "User picked up";
  } else if (status === ORDER_STATUS.PREPARED) {
    return "Prepared";
  } else if (status === ORDER_STATUS.REFUND_REJECTED) {
    return "Refund refused";
  } else {
    return "Paid";
  }
};

export const getStatusColor = (status?: number) => {
  switch (status) {
    case ORDER_STATUS.ON_GOING:
    case ORDER_STATUS.REFUNDING:
      return "#FCD298";
    case ORDER_STATUS.CONFIRMED:
    case ORDER_STATUS.DELIVERED:
    case ORDER_STATUS.SUCCEEDED:
    case ORDER_STATUS.COMPLETED:
    case ORDER_STATUS.SETTLED:
    case ORDER_STATUS.USER_PICKED_UP:
      return "#12B76A";
    case ORDER_STATUS.DELIVERING:
    case ORDER_STATUS.WAITING_FOR_PAYMENT:
      return "#fff";
    case ORDER_STATUS.REFUNDED:
    case ORDER_STATUS.REJECTED:
    default:
      return "#F25A5A";
  }
};

export const ON_GOING_STATUS = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.DELIVERING,
  ORDER_STATUS.REFUNDING,
  ORDER_STATUS.WAITING_FOR_PAYMENT,
  ORDER_STATUS.ON_GOING,
  ORDER_STATUS.PREPARED,
  ORDER_STATUS.PAID,
];

export const CANCEL_STATUS = [ORDER_STATUS.CANCELLED, ORDER_STATUS.REJECTED, ORDER_STATUS.EXPIRED];
