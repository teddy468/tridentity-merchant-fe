export const routers = {
  DASHBOARD: "/",
  PROFILE: "/profile",
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  REGISTER: "/register",
  NOT_FOUND: "/*",
  RESET_PASSWORD: "/auth/reset-password",
  FORGOT_SUCCESS: "/forgot-success",
  SIGN_UP: "/sign-up",
  MERCHANT_MEMBER: "/merchant-member",
  LP_MEMBER_SHIP: {
    INFO: "/lp-membership/info",
    LOYALTY_POINTS: "/lp-membership/loyalty-points",
    MEMBERSHIP: "/lp-membership/membership",
    CAMPAIGN_LIST: "/lp-membership/campaign-list",
    CAMPAIGN_DETAIL: "/lp-membership/campaign-detail/:id",
    CAMPAIGN_SUMMARY: "/lp-membership/campaign-summary/:id",
    LP_CASH_OUT: "/lp-membership/lp-cashout",
    LP_BUY_MORE: "/lp-membership/lp-buymore",
  },
  ACCOUNT_INFORMATION: "/account-information",
  UPDATE_ACCOUNT_INFORMATION: "/account-information/update",
  NOTIFICATION: "/notification",
  RECONCILIATION: "/settlement-report",
  RECONCILIATION_DETAIL: "/settlement-report/:id",
  SUPPORT_CENTER: "/support-center",
  MERCHANT_ONBOARD: "/merchant-onboard/accept/:merchantOnboardId",
  STORES: {
    LIST: "/stores",
    CREATE_STORE: "/stores/create",
    STORE_DASHBOARD: "/stores/:storeId",
    PRODUCT_MANAGEMENT: "/stores/:storeId/product-management",
    CREATE_PRODUCT: "/stores/:storeId/create-product",
    CREATE_BADGE: "/stores/:storeId/create-badge",
    UPDATE_PRODUCT: "/stores/:storeId/product-management/:productId",
    UPDATE_PRODUCT_APPROVAL: "/stores/:storeId/product-management/approval/:approvalId",
    BADGE_MANAGEMENT: "/stores/:storeId/badge-management",
    UPDATE_BADGE_MANAGEMENT: "/stores/:storeId/badge-management/:badgeId",
    MERCHANT_LANDING_PAGE: "/stores/:storeId/landing-page",
    ORDER_TRACKING: "/stores/:storeId/order-tracking",
    ORDER_TRACKING_DETAIL: "/stores/:storeId/order-tracking/:orderId",
    REFUND_MANAGEMENT: "/stores/:storeId/refund-management",
    RATE_MANAGEMENT: "/stores/:storeId/rate-management",
    RATE_MANAGEMENT_DETAIL: "/stores/:storeId/rate-management/:id",
    INVENTORY_MANAGEMENT: "/stores/:storeId/inventory-management",
    INVENTORY_LOG: "/stores/:storeId/inventory-log/:prodId",
    REFUND_MANAGEMENT_DETAIL: "/stores/:storeId/refund-management/:id",
    CHAT_INBOX: "/stores/:storeId/chat-inbox",
    REPORT: "/stores/:storeId/report",
    VOUCHER_LIST: "/stores/:storeId/voucher-list",
    VOUCHER_DETAIL: "/stores/:storeId/voucher/:voucherId",
    CREATE_VOUCHER: "/stores/:storeId/create-voucher",
    EDIT_VOUCHER: "/stores/:storeId/edit-voucher/:voucherId",
  },
};

export const navigations = {
  DASHBOARD: routers.DASHBOARD,
  PROFILE: routers.PROFILE,
  FORGOT_SUCCESS: routers.FORGOT_SUCCESS,
  LOGIN: routers.LOGIN,
  REGISTER: routers.REGISTER,
  NOT_FOUND: routers.NOT_FOUND,
  RESET_PASSWORD: routers.RESET_PASSWORD,
  SIGN_UP: routers.SIGN_UP,
  MERCHANT_MEMBER: routers.MERCHANT_MEMBER,
  LP_MEMBER_SHIP: {
    INFO: routers.LP_MEMBER_SHIP.INFO,
    LOYALTY_POINTS: routers.LP_MEMBER_SHIP.LOYALTY_POINTS,
    MEMBERSHIP: routers.LP_MEMBER_SHIP.MEMBERSHIP,
    CAMPAIGN_LIST: routers.LP_MEMBER_SHIP.CAMPAIGN_LIST,
    LP_CASH_OUT: routers.LP_MEMBER_SHIP.LP_CASH_OUT,
    LP_BUY_MORE: routers.LP_MEMBER_SHIP.LP_BUY_MORE,
    CAMPAIGN_DETAIL: (id: number | string) => routers.LP_MEMBER_SHIP.CAMPAIGN_DETAIL.replace(":id", id.toString()),
    CAMPAIGN_SUMMARY: (id: number | string) => routers.LP_MEMBER_SHIP.CAMPAIGN_SUMMARY.replace(":id", id.toString()),
  },
  ACCOUNT_INFORMATION: routers.ACCOUNT_INFORMATION,
  SUPPORT_CENTER: routers.SUPPORT_CENTER,
  RECONCILIATION_DETAIL: (id: number | string) => routers.RECONCILIATION_DETAIL.replace(":id", id.toString()),
  STORES: {
    LIST: routers.STORES.LIST,
    CREATE_STORE: routers.STORES.CREATE_STORE,
    STORE_DASHBOARD: (id: number | string) => routers.STORES.STORE_DASHBOARD.replace(":storeId", id.toString()),
    PRODUCT_MANAGEMENT: (id: number | string) => routers.STORES.PRODUCT_MANAGEMENT.replace(":storeId", id.toString()),
    CREATE_PRODUCT: (id: number | string) => routers.STORES.CREATE_PRODUCT.replace(":storeId", id.toString()),
    CREATE_BADGE: (id: number | string) => routers.STORES.CREATE_BADGE.replace(":storeId", id.toString()),
    UPDATE_PRODUCT: (storeId: number | string, productId: number | string) =>
      routers.STORES.UPDATE_PRODUCT.replace(":storeId", storeId.toString()).replace(":productId", productId.toString()),
    UPDATE_PRODUCT_APPROVAL: (storeId: number | string, approvalId: number | string) =>
      routers.STORES.UPDATE_PRODUCT_APPROVAL.replace(":storeId", storeId.toString()).replace(
        ":approvalId",
        approvalId.toString()
      ),

    BADGE_MANAGEMENT: (id: number | string) => routers.STORES.BADGE_MANAGEMENT.replace(":storeId", id.toString()),
    UPDATE_BADGE: (storeId: number | string, badgeId: number | string) =>
      routers.STORES.UPDATE_BADGE_MANAGEMENT.replace(":storeId", storeId.toString()).replace(
        ":badgeId",
        badgeId.toString()
      ),

    ORDER_TRACKING: (id: number | string) => routers.STORES.ORDER_TRACKING.replace(":storeId", id.toString()),
    MERCHANT_LANDING_PAGE: (id: number | string) =>
      routers.STORES.MERCHANT_LANDING_PAGE.replace(":storeId", id.toString()),
    ORDER_TRACKING_DETAIL: (storeId: number | string, orderId: number | string) =>
      routers.STORES.ORDER_TRACKING_DETAIL.replace(":storeId", storeId.toString()).replace(
        ":orderId",
        orderId.toString()
      ),
    REFUND_MANAGEMENT: (id: number | string) => routers.STORES.REFUND_MANAGEMENT.replace(":storeId", id.toString()),
    RATE_MANAGEMENT: (id: number | string) => routers.STORES.RATE_MANAGEMENT.replace(":storeId", id.toString()),
    RATE_MANAGEMENT_DETAIL: (storeId: number | string, id: number | string) =>
      routers.STORES.RATE_MANAGEMENT_DETAIL.replace(":storeId", storeId.toString()).replace(":id", id.toString()),
    INVENTORY_MANAGEMENT: (id: number | string) =>
      routers.STORES.INVENTORY_MANAGEMENT.replace(":storeId", id.toString()),
    INVENTORY_LOG: (id: number | string, prodId: number | string) =>
      routers.STORES.INVENTORY_LOG.replace(":storeId", id.toString()).replace(":prodId", prodId.toString()),
    CHAT_INBOX: (id: number | string) => routers.STORES.CHAT_INBOX.replace(":storeId", id.toString()),
    REPORT: (id: number | string) => routers.STORES.REPORT.replace(":storeId", id.toString()),
    VOUCHER_LIST: (id: number | string) => routers.STORES.VOUCHER_LIST.replace(":storeId", id.toString()),
    VOUCHER_DETAIL: (id: number | string, voucherId: number | string) =>
      routers.STORES.VOUCHER_DETAIL.replace(":storeId", id.toString()).replace(":voucherId", voucherId.toString()),
    CREATE_VOUCHER: (id: number | string) => routers.STORES.CREATE_VOUCHER.replace(":storeId", id.toString()),
    EDIT_VOUCHER: (id: number | string, voucherId: number | string) =>
      routers.STORES.EDIT_VOUCHER.replace(":storeId", id.toString()).replace(":voucherId", voucherId.toString()),
  },
};

export const titles = {
  [routers.DASHBOARD]: "Home",
  [routers.PROFILE]: "Profile",
  [routers.LOGIN]: "Login",
  [routers.REGISTER]: "Register",
  [routers.RESET_PASSWORD]: "Reset Password",
  [routers.SIGN_UP]: "Sign Up",
  [routers.STORES.PRODUCT_MANAGEMENT]: "Product Management",
};

export const NOT_FOUND = "Not Found";
