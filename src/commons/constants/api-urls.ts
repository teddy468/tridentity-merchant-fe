export const LOGIN_URL = "merchants/auth/login";
export const MERCHANT_ONBOARD_REQUEST = "merchant-onboard/request";
export const MERCHANT_OBBOARD_REQUEST_VERIFY = (merchantOnboardId: string) =>
  `merchant-onboard/${merchantOnboardId}/request-verify`;
export const MERCHANT_ONBOARD_SET_PASSWORD = `merchants/auth/admin/activate`;
export const MERCHANT_ONBOARD_VERIFY = (merchantOnboardId: string) => `merchant-onboard/${merchantOnboardId}/verify`;
export const ORDER_TRACKING_URL = (id: string | number) => `merchant-stores/${id}/orders/`;
export const ORDER_TRACKING_CONFIRM_URL = (id: string | number) => `merchants/orders/${id}/confirm`;
export const ORDER_TRACKING_DETAIL = "merchants/orders/";
export const PRODUCTS_URL = "products";
export const CATEGORIES_URL = "categories";
export const CATEGORIES_PARENT_URL = "categories/parents";
export const CATEGORIES_CHILDREN_URL = `categories/descendants`;
export const NEW_CATEGORY_URL = "merchant-store-category";
export const ALL_ATTRIBUTES_URL = "merchant/attributes/all";

export const STORE_DETAIL_URL = (storeId: string | number) => `merchant-stores/${storeId}`;
export const STORE_ADDRESS_URL = (storeId: string | number) => `merchant-stores/${storeId}/addresses`;
export const CREATE_STORE_URL = (merchantId: string | number) => `merchants/${merchantId}/merchant-stores`;
export const UPDATE_STORE_URL = (storeId: string | number) => `merchant-stores/${storeId}`;
export const CREATE_STORE_REQUEST_URL = "merchant-store-onboards";
export const GET_STORE_REQUEST_URL = `merchant-store-onboards/pending`;
export const GET_STORE_REJECTED_URL = `merchant-store-onboards/rejected`;
export const UPDATE_STORE_REQUEST_URL = `merchant-store-approvals`;
export const GET_STORE_UPDATE_REQUEST_URL = `merchant-store-approvals/pending`;
export const GET_STORE_UPDATE_REJECTED_URL = `merchant-store-approvals/rejected`;
export const CREATE_STORE_ADDRESS_REQUEST_URL = (storeId: string | number) =>
  `merchant-store-onboards/merchant-stores/${storeId}/addresses`;
export const UPDATE_STORE_ADDRESS_REQUEST_URL = `/merchant-store-approvals/addresses`;
export const CREATE_STORE_ADDRESS_URL = (storeId: string | number) => `merchant-stores/${storeId}/addresses`;
export const UPDATE_STORE_ADDRESS_URL = (storeId: string | number) => `merchant-store-addresses/${storeId}`;
export const CHANGE_STORE_STATUS_URL = (storeId: string | number) => `merchant-stores/${storeId}/set-status`;
export const CREATE_PRODUCT_URL = "merchant-management/products/save-and-publish";
export const CREATE_PRODUCT_DRAFT_URL = "merchant-management/products/save-draft";
export const UPDATE_PRODUCT_URL = (productId: string | number) => `merchant-management/products/${productId}`;
export const UPDATE_PRODUCT_APPROVAL_URL = (approvalId: string | number) =>
  `merchant-management/products-approval/${approvalId}`;
export const PUBLISH_DRAFT_PRODUCT_URL = `merchant-management/products/publish`;
export const GET_PRODUCT_APPROVAL_DETAIL_URL = (approvalId: string | number) =>
  `merchant-management/products-approval/${approvalId}`;

export const MARK_PRODUCT_SOLD_OUT = (productId: string | number) =>
  `merchant-management/products/mark-is-sold/${productId}`;

export const REFUND_REQUEST_URL = (storeId: string | number) =>
  `merchant-management/transactions/merchant-stores/${storeId}/refunds`;
export const REFUND_REQUEST_DETAIL_URL = (refundId: string | number) => `merchant-management/transactions/${refundId}`;
export const REFUND_PUT_STATUS_URL = (refundId: string | number) =>
  `merchant-management/transactions/${refundId}/status`;
export const RATE_URL = (storeId: string | number) => `merchant-stores/${storeId}/ratings`;
export const RATE_DETAIL_URL = (rateId: string | number) => `merchant-stores/ratings/${rateId}`;
export const UPLOAD_FILE_URL = "storage/upload";
export const UPLOAD_PRODUCT_JSON = (id: string | number) => `merchant-management/merchant-stores/${id}/products/upload`;
export const UPLOAD_PRODUCT_CSV = (id: string | number) =>
  `merchant-management/merchant-stores/${id}/products/upload/csv`;

export const MERCHANT_ACOUNT_INFORMATION = () => `merchants/account-information`;
export const MERCHANT_REQUEST_UPDATE_ACCOUNT_INFORMATION = () => `merchants`;
export const MERCHANT_STORES_URL = (id: string | number) => `merchants/${id}/merchant-stores`;
export const MERCHANTS_PRODUCTS_URL = (id: string | number) => `merchant-management/merchant-stores/${id}/products`;
export const MERCHANTS_PRODUCTS_APPROVAL_URL = (id: string | number) =>
  `merchant-management/merchant-stores/${id}/products-approval`;
export const CLONE_MERCHANTS_PRODUCTS_URL = (id: string | number) => `merchant-management/products/${id}/clone`;
export const PRODUCT_DETAIL_URL = (id: string | number) => `v2/products/${id}`;
export const PRODUCT_MERCHANT_STORE_COUNT_URL = (id: string | number) =>
  `merchant-management/merchant-stores/${id}/products/count`;

export const PRODUCT_MERCHANT_WAIT_APPROVAL_STORE_COUNT_URL = (id: string | number) =>
  `merchant-management/merchant-stores/${id}/product-approvals/count`;

export const PRODUCT_MERCHANT_STORE_SETTINGS_URL = (id: string | number) =>
  `merchant-management/products/${id}/settings`;

export const MERCHANT_INFO_URL = (id: string | number) => `merchants/${id}`;

export const MERCHANT_SETTLEMENT_URL = (id: string | number) => `merchant-management/merchants/${id}/settlements`;
export const MERCHANT_SETTLEMENT_DETAIL_URL = (id: string | number) => `merchant-management/settlements/${id}`;
export const MERCHANT_SETTLEMENT_DETAIL_INVOLVE_STORE_URL = (settlementId: string | number) =>
  `merchant-management/settlements/${settlementId}/involved-stores`;
export const MERCHANT_SETTLEMENT_DETAIL_ORDER_URL = (merchantId: string | number) => `merchants/${merchantId}/orders`;
export const MERCHANT_SETTLEMENT_GENERAL_INFO_URL = (merchantId: string | number) =>
  `merchants/${merchantId}/orders/general`;
export const MERCHANT_SETTLEMENT_DETAIL_ORDER_EXPORT_URL = (merchantId: string | number) =>
  `merchants/${merchantId}/orders/export`;
export const MERCHANT_SETTLEMENT_LP_URL = (id: string | number) => `merchants/${id}/loyalty-point`;
export const MERCHANT_SETTLEMENT_REQUEST_CASH_OUT_URL = `merchant-management/settlements/request-cash-out`;
export const MERCHANT_SETTLEMENT_REQUEST_PAYMENT_URL = `merchant-management/settlements/request-payment`;
export const MERCHANT_SETTLEMENT_REQUEST_PAYMENT_CONFIRM_URL = `merchant-management/settlements/mark-as-paid`;

export const CREATE_MERCHANT_CAMPAIGN = `merchant-management/campaigns`;
export const UPDATE_MERCHANT_CAMPAIGN = (id: number | string) => `merchant-management/campaigns/${id}`;
export const GET_MERCHANT_CAMPAIGN = (merchantId: string | number) =>
  `merchant-management/merchants/${merchantId}/campaigns`;
export const MERCHANT_CAMPAIGN_DETAIL = (id: string | number) => `merchant-management/campaigns/${id}`;
export const MERCHANT_CAMPAIGN_DETAIL_ALLOCATION = (id: string | number) =>
  `merchant-management/campaigns/${id}/total-allocation`;
export const MERCHANT_CAMPAIGN_PRODUCTS = (id: string | number) => `merchant-management/campaigns/${id}/products`;
export const MERCHANT_CAMPAIGN_ORDERS = (id: string | number) => `campaigns/${id}/orders`;

export const DELETE_MERCHANT_CAMPAIGN_PRODUCTS = (campaignId: string | number, productId: string | number) =>
  `merchant-management/campaigns/${campaignId}/products/${productId}`;
export const PUT_MERCHANT_CAMPAIGN_PRODUCTS = (campaignId: string | number, productId: string | number) =>
  `merchant-management/campaigns/${campaignId}/products/${productId}`;
// merchant member
export const MERCHANT_MEMBER_LIST = () => `merchant-stores/members`;
export const ADD_NEW_MEMBER_MERCHANT = `merchant-onboard/member-request`;
export const DELETE_MEMBER_MERCHANT = () => `merchant-users/toggle-merchant-member-status`;
export const EDIT_MEMBER_MERCHANT = () => `merchant-store-authority/update-merchant-member-stores`;

export const REPORT_ORDER_LIST = (store_id: string | number) => `merchant-stores/${store_id}/orders/report`;
export const REPORT_TOTAL_INFO = (store_id: string | number) => `merchant-stores/${store_id}/orders/report/general`;
export const REPORT_BEST_SELLER = (store_id: string | number) =>
  `merchant-stores/${store_id}/orders/report/best-seller`;
export const REPORT_EXPORT_ORDER_LIST = (store_id: string | number) => `merchant-stores/${store_id}/orders/export`;
export const REPORT_CHART = (store_id: string | number) => `merchant-stores/${store_id}/orders/report/fiat/v2`;

export const CONVERSATIONS = (store_id: string | number) => `chats/merchant-stores/${store_id}/conversations`;
export const UNREAD_CONVERSATION = (store_id: string | number) => `chats/merchant-stores/${store_id}/total-unread`;
export const CONVERSATION_DETAIL = (store_id: string | number, user_id: string | number) =>
  `chats/merchant-stores/${store_id}/users/${user_id}/conversation`;
export const SEND_MESSAGE = (store_id: string | number) => `chats/merchant-stores/${store_id}/send-message-to-user`;
export const READ_MESSAGE = (user_id: string | number) => `chats/merchants/${user_id}/read`;
// Badge

export const BADGE_MANAGEMENT_URL = (store_id: string | number) => `merchant-stores/${store_id}/badges`;
export const BADGE_DETAIl_URL = (badgeId: string | number) => `badges/${badgeId}`;

export const INVENTORY_LIST = (store_id: string | number) => `inventory/${store_id}/products`;
export const INVENTORY_PROD_DETAIL = (store_id: string | number, prodId: string | number) =>
  `inventory/${store_id}/product/${prodId}`;
export const INVENTORY_LOG = (store_id: string | number, prodId: string | number) =>
  `inventory/${store_id}/product/${prodId}/history-change`;

export const UPDATE_INVENTORY_STOCK = (store_id: string | number) => `inventory/${store_id}/stock`;

// Noti

export const NOTIFICATION_LIST = `merchant-notifications`;
export const NOTIFICATION_READ = (id: string | number) => `merchant-notifications/${id}/mark-as-read`;
export const NOTIFICATION_COUNT = `merchant-notifications/unread`;

// LP
export const LP_TRANSACTION = `merchant-loyalty-point-history`;
export const LP_POINT = `merchants/loyalty-point/me`;
export const LP_CASH_OUT = `lp-cashout-request/merchant`;
export const LP_CASH_OUT_LIST = `lp-cashout-request/merchant`;
export const LP_RATE = `parameter-config/merchant-exchange-rate`;
export const LP_RECEIVED = (id: string | number) => `lp-cashout-request/merchant/${id}/receive`;

//
export const LP_BUY_MORE_LIST = `lp-buying-request/merchant`;
export const LP_BUY_MORE = `lp-buying-request/merchant`;
export const LP_BUY_MORE_RECEIVED = (id: string | number) => `lp-buying-request/merchant/${id}/receive`;

export const FORGOT_PASSWORD = `merchants/auth/forgot-password`;
export const RESET_PASSWORD = `merchants/auth/reset-password`;

// membership
export const MEMBERSHIP = `merchant-membership`;
export const COLLECTIONS = `merchant-membership/collections`;
export const REQUEST_UPDATE = `merchant-membership/request-upgrade`;
export const PARAMS_MERCHANT = `parameter-config/merchant-membership`;
export const PARAMS_PLATFORM_FEE = `parameter-config/platform-fee`;

// voucher
export const VOUCHER = `merchant-management/vouchers`;
export const VOUCHER_MANAGEMENT = (merchantId: string | number) =>
  `merchant-management/merchants/${merchantId}/vouchers`;

export const VOUCHER_ODERS = (voucherId: string | number) => `vouchers/${voucherId}/orders`;
export const VOUCHER_DETAIL = (voucherId: string | number) => `merchant-management/vouchers/${voucherId}`;
export const PRODUCTS_VOUCHER = (voucherId: string | number) => `merchant-management/vouchers/${voucherId}/products`;

// min-platform-order
export const MIN_PLATFORM_ORDER = `parameter-config/platform-min-order`;
