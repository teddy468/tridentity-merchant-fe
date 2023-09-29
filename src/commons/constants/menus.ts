import {
  BellIcon,
  PeopleIcon,
  ReconciliationIcon,
  SettingIcon,
  ShoppingIcon,
  TicketIcon,
  UserIcon,
} from "../../assets/icons";
import { navigations, routers } from "./routers";

declare interface MenuItem {
  path: string;
  icon: React.FunctionComponent;
  label: string;
  hasNoty?: boolean;
  isStore?: boolean;
  count?: number;
  renderPath?: (...ids: (string | number)[]) => string;
  children?: { path: string; renderPath: (...ids: (string | number)[]) => string; label: string }[];
}

export const menus: MenuItem[] = [
  {
    path: routers.STORES.LIST,
    icon: ShoppingIcon,
    label: "Choose a Store",
  },
  {
    path: "#",
    icon: ShoppingIcon,
    label: "Choose a Store",
    isStore: true,
    children: [
      {
        path: routers.STORES.PRODUCT_MANAGEMENT,
        renderPath: navigations.STORES.PRODUCT_MANAGEMENT,
        label: "Product Management",
      },
      // {
      //   path: routers.STORES.PRODUCT_MANAGEMENT,
      //   renderPath: navigations.STORES.MERCHANT_LANDING_PAGE,
      //   label: "Landing Page",
      // },
      // {
      //   path: routers.STORES.INVENTORY_MANAGEMENT,
      //   renderPath: navigations.STORES.INVENTORY_MANAGEMENT,
      //   label: "Inventory Management",
      // },
      // {
      //   path: routers.STORES.PRODUCT_MANAGEMENT,
      //   renderPath: navigations.STORES.BADGE_MANAGEMENT,
      //   label: "Badge Management",
      // },
      {
        path: routers.STORES.PRODUCT_MANAGEMENT,
        renderPath: navigations.STORES.ORDER_TRACKING,
        label: "Order Tracking",
      },
      // {
      //   path: routers.STORES.PRODUCT_MANAGEMENT,
      //   renderPath: navigations.STORES.REFUND_MANAGEMENT,
      //   label: "Refund Management",
      // },
      {
        path: routers.STORES.RATE_MANAGEMENT,
        renderPath: navigations.STORES.RATE_MANAGEMENT,
        label: "Rating Management",
      },
      // {
      //   path: routers.STORES.PRODUCT_MANAGEMENT,
      //   renderPath: navigations.STORES.CHAT_INBOX,
      //   label: "Chat Inbox",
      // },
      {
        path: routers.STORES.PRODUCT_MANAGEMENT,
        renderPath: navigations.STORES.REPORT,
        label: "Report",
      },
      // {
      //   path: routers.STORES.VOUCHER_LIST,
      //   renderPath: navigations.STORES.VOUCHER_LIST,
      //   label: "Voucher",
      // },
    ],
  },
  {
    path: routers.NOTIFICATION,
    icon: BellIcon,
    label: "Notifications",
    hasNoty: true,
  },
  {
    path: routers.MERCHANT_MEMBER,
    icon: PeopleIcon,
    label: "Merchant Member",
  },
  {
    path: routers.LP_MEMBER_SHIP.INFO,
    icon: TicketIcon,
    isStore: false,
    label: "LP & Membership",
    children: [
      {
        path: routers.LP_MEMBER_SHIP.LOYALTY_POINTS,
        renderPath: navigations.LP_MEMBER_SHIP.LOYALTY_POINTS as any,
        label: "Loyalty Points",
      },
      {
        path: routers.LP_MEMBER_SHIP.LP_CASH_OUT,
        renderPath: navigations.LP_MEMBER_SHIP.LP_CASH_OUT as any,
        label: "LP Cash Out Requests",
      },
      {
        path: routers.LP_MEMBER_SHIP.LP_BUY_MORE,
        renderPath: navigations.LP_MEMBER_SHIP.LP_BUY_MORE as any,
        label: "Buy More LP Requests",
      },
      {
        path: routers.LP_MEMBER_SHIP.CAMPAIGN_LIST,
        renderPath: navigations.LP_MEMBER_SHIP.CAMPAIGN_LIST as any,
        label: "Marketing Campaign",
      },
      {
        path: routers.LP_MEMBER_SHIP.MEMBERSHIP,
        renderPath: navigations.LP_MEMBER_SHIP.MEMBERSHIP as any,
        label: "Membership",
      },
    ],
  },
  {
    path: routers.RECONCILIATION,
    icon: ReconciliationIcon,
    label: "Settlement report",
  },
  {
    path: routers.ACCOUNT_INFORMATION,
    icon: UserIcon,
    label: "Account Information",
  },
  {
    path: routers.SUPPORT_CENTER,
    icon: SettingIcon,
    label: "Support Center",
  },
];

export const menusMerchantMember: MenuItem[] = [
  {
    path: routers.STORES.LIST,
    icon: ShoppingIcon,
    label: "Choose a Store",
  },
  {
    path: "#",
    icon: ShoppingIcon,
    label: "Choose a Store",
    isStore: true,
    children: [
      {
        path: routers.STORES.PRODUCT_MANAGEMENT,
        renderPath: navigations.STORES.PRODUCT_MANAGEMENT,
        label: "Product Management",
      },
      // {
      //   path: routers.STORES.PRODUCT_MANAGEMENT,
      //   renderPath: navigations.STORES.BADGE_MANAGEMENT,
      //   label: "Badge Management",
      // },
      {
        path: routers.STORES.PRODUCT_MANAGEMENT,
        renderPath: navigations.STORES.ORDER_TRACKING,
        label: "Order Tracking",
      },
      {
        path: routers.STORES.RATE_MANAGEMENT,
        renderPath: navigations.STORES.RATE_MANAGEMENT,
        label: "Rating Management",
      },
      // {
      //   path: routers.STORES.PRODUCT_MANAGEMENT,
      //   renderPath: navigations.STORES.CHAT_INBOX,
      //   label: "Chat Inbox",
      // },
      {
        path: routers.STORES.PRODUCT_MANAGEMENT,
        renderPath: navigations.STORES.REPORT,
        label: "Report",
      },
    ],
  },
  {
    path: routers.NOTIFICATION,
    icon: BellIcon,
    label: "Notifications",
    hasNoty: true,
  },
  {
    path: routers.SUPPORT_CENTER,
    icon: SettingIcon,
    label: "Support Center",
  },
];
