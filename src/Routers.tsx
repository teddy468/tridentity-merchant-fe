import { Route, Routes } from "react-router-dom";
import { routers } from "./commons/constants/routers";
import CampaignDetail from "./components/CampaignListComp/detail";
import LPBuyMore from "./components/LPBuyMore";
import LPCashOut from "./components/LPCashOut";
import AccountInformationPage from "./pages/AccountInformation/AccountInformation";
import UpdateAccountInformation from "./pages/UpdateAccountInformation/UpdateAccountInformation";
import CampaignList from "./pages/CampaignList";
import CreateUpdateProductPage from "./pages/CreateUpdateProduct/CreateUpdateProduct";
import CreateUpdateStorePage from "./pages/CreateUpdateStore/CreateUpdateStore";
import ForgotPasswordPage from "./pages/ForgotPassword";
import ForgotSuccessPage from "./pages/ForgotSuccess";
import Icons from "./pages/Icons/Icons";
import InventoryLogPage from "./pages/InventoryLog/InventoryLog";
import InventoryManagementPage from "./pages/InventoryManagement/InventoryMangement";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/Login";
import LoyaltyPoint from "./pages/LoyaltyPoint";
import LPMembership from "./pages/LPMembership";
import MerchantMemberPage from "./pages/MerchantMember/MerchantMember";
import MerchantOnBoard from "./pages/MerchantOnboard/MerchantOnboard";
import NotFoundPage from "./pages/NotFound";
import NotificationPage from "./pages/Notification/Notification";
import OrderTracking from "./pages/OrderTracking";
import OrderDetailPage from "./pages/OrderTracking/OrderDetail";
import ProductManagementPage from "./pages/ProductMangement";
import RatingDetail from "./pages/RatingDetail";
import RatingManagement from "./pages/RatingManagement";
import ReconciliationPage from "./pages/Reconciliation";
import ReconciliationDetailPage from "./pages/Reconciliation/detail";
import RefundDetailPage from "./pages/RefundDetail";
import RefundManagementPage from "./pages/RefundManagement";
import Report from "./pages/Report";
import ResetPasswordPage from "./pages/ResetPassword";
import SignUpPage from "./pages/Signup";
import StoreMangementPage from "./pages/StoreMangement/StoreMangement";
import CampaignSummaryComp from "./components/CampaignListComp/summary";
import VoucherListPage from "./pages/VoucherList/VoucherListPage";
import VoucherDetailPage from "./pages/VoucherDetail/VoucherDetailPage";
import CreateAndUpdateVoucherPage from "./pages/CreateAndUpdateVoucher/CreateAndUpdateVoucherPage";
import CreateUpdateProductApprovalPage from "./pages/CreateUpdateProduct/CreateUpdateProductApproval";
import Dashboard from "./pages/Dashboard";
import { useContext } from "react";
import { AppContext } from "./contexts/AppContext";
import { MODES } from "./commons/constants/user";

const Routers: React.FC = () => {
  const { user } = useContext(AppContext);
  if (!user) {
    return (
      <Routes>
        <Route path={routers.LOGIN} element={<LoginPage />} />
        <Route path={routers.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={routers.FORGOT_SUCCESS} element={<ForgotSuccessPage />} />
        <Route path={routers.NOT_FOUND} element={<NotFoundPage />} />
        <Route path={routers.RESET_PASSWORD} element={<ResetPasswordPage />} />
        <Route path={routers.SIGN_UP} element={<SignUpPage />} />
        <Route path={routers.MERCHANT_ONBOARD} element={<MerchantOnBoard />} />
        <Route path={"/icons"} element={<Icons />} />
      </Routes>
    );
  } else if (user?.merchant_role?.id === MODES.ADMIN) {
    return (
      <Routes>
        <Route path={routers.DASHBOARD} element={<Dashboard />} />
        <Route path={routers.LOGIN} element={<LoginPage />} />
        <Route path={routers.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={routers.FORGOT_SUCCESS} element={<ForgotSuccessPage />} />
        <Route path={routers.NOT_FOUND} element={<NotFoundPage />} />
        <Route path={routers.RESET_PASSWORD} element={<ResetPasswordPage />} />
        <Route path={routers.SIGN_UP} element={<SignUpPage />} />
        <Route path={routers.STORES.LIST} element={<StoreMangementPage />} />
        <Route path={routers.STORES.REPORT} element={<Report />} />
        <Route path={routers.LP_MEMBER_SHIP.INFO} element={<LPMembership />} />
        <Route path={routers.LP_MEMBER_SHIP.CAMPAIGN_LIST} element={<CampaignList />} />
        <Route path={routers.LP_MEMBER_SHIP.CAMPAIGN_DETAIL} element={<CampaignDetail />} />
        <Route path={routers.LP_MEMBER_SHIP.CAMPAIGN_SUMMARY} element={<CampaignSummaryComp />} />
        <Route path={routers.LP_MEMBER_SHIP.MEMBERSHIP} element={<LPMembership />} />
        <Route path={routers.LP_MEMBER_SHIP.LOYALTY_POINTS} element={<LoyaltyPoint />} />
        <Route path={routers.LP_MEMBER_SHIP.LP_CASH_OUT} element={<LPCashOut />} />
        <Route path={routers.LP_MEMBER_SHIP.LP_BUY_MORE} element={<LPBuyMore />} />
        <Route path={routers.STORES.MERCHANT_LANDING_PAGE} element={<LandingPage />} />
        <Route path={routers.STORES.INVENTORY_MANAGEMENT} element={<InventoryManagementPage />} />
        <Route path={routers.STORES.INVENTORY_LOG} element={<InventoryLogPage />} />
        <Route path={routers.STORES.CREATE_STORE} element={<CreateUpdateStorePage />} />
        <Route path={routers.STORES.CREATE_PRODUCT} element={<CreateUpdateProductPage />} />
        <Route path={routers.STORES.UPDATE_PRODUCT} element={<CreateUpdateProductPage />} />
        <Route path={routers.STORES.UPDATE_PRODUCT_APPROVAL} element={<CreateUpdateProductApprovalPage />} />
        <Route path={routers.STORES.STORE_DASHBOARD} element={<CreateUpdateStorePage />} />
        <Route path={routers.STORES.PRODUCT_MANAGEMENT} element={<ProductManagementPage />} />
        <Route path={routers.STORES.RATE_MANAGEMENT} element={<RatingManagement />} />
        <Route path={routers.STORES.RATE_MANAGEMENT_DETAIL} element={<RatingDetail />} />
        <Route path={routers.STORES.ORDER_TRACKING} element={<OrderTracking />} />
        <Route path={routers.STORES.ORDER_TRACKING_DETAIL} element={<OrderDetailPage />} />
        <Route path={routers.STORES.REFUND_MANAGEMENT} element={<RefundManagementPage />} />
        <Route path={routers.STORES.REFUND_MANAGEMENT_DETAIL} element={<RefundDetailPage />} />
        <Route path={routers.STORES.VOUCHER_LIST} element={<VoucherListPage />} />
        <Route path={routers.STORES.VOUCHER_DETAIL} element={<VoucherDetailPage />} />
        <Route path={routers.STORES.CREATE_VOUCHER} element={<CreateAndUpdateVoucherPage />} />
        <Route path={routers.STORES.EDIT_VOUCHER} element={<CreateAndUpdateVoucherPage />} />
        <Route path={routers.MERCHANT_ONBOARD} element={<MerchantOnBoard />} />
        <Route path={routers.NOTIFICATION} element={<NotificationPage />} />
        <Route path={routers.ACCOUNT_INFORMATION} element={<AccountInformationPage />} />
        <Route path={routers.UPDATE_ACCOUNT_INFORMATION} element={<UpdateAccountInformation />} />
        <Route path={routers.MERCHANT_MEMBER} element={<MerchantMemberPage />} />
        <Route path={routers.RECONCILIATION} element={<ReconciliationPage />} />
        <Route path={routers.RECONCILIATION_DETAIL} element={<ReconciliationDetailPage />} />
        <Route path={"/icons"} element={<Icons />} />
      </Routes>
    );
  } else {
    return (
      <Routes>
        <Route path={routers.DASHBOARD} element={<Dashboard />} />
        <Route path={routers.LOGIN} element={<LoginPage />} />
        <Route path={routers.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={routers.FORGOT_SUCCESS} element={<ForgotSuccessPage />} />
        <Route path={routers.NOT_FOUND} element={<NotFoundPage />} />
        <Route path={routers.RESET_PASSWORD} element={<ResetPasswordPage />} />
        <Route path={routers.SIGN_UP} element={<SignUpPage />} />
        <Route path={routers.STORES.STORE_DASHBOARD} element={<CreateUpdateStorePage />} />
        <Route path={routers.STORES.REPORT} element={<Report />} />
        <Route path={routers.STORES.LIST} element={<StoreMangementPage />} />
        <Route path={routers.STORES.MERCHANT_LANDING_PAGE} element={<LandingPage />} />
        <Route path={routers.STORES.INVENTORY_MANAGEMENT} element={<InventoryManagementPage />} />
        <Route path={routers.STORES.INVENTORY_LOG} element={<InventoryLogPage />} />
        <Route path={routers.STORES.CREATE_STORE} element={<CreateUpdateStorePage />} />
        <Route path={routers.STORES.CREATE_PRODUCT} element={<CreateUpdateProductPage />} />
        <Route path={routers.STORES.UPDATE_PRODUCT} element={<CreateUpdateProductPage />} />
        <Route path={routers.STORES.UPDATE_PRODUCT_APPROVAL} element={<CreateUpdateProductApprovalPage />} />
        <Route path={routers.STORES.STORE_DASHBOARD} element={<CreateUpdateStorePage />} />
        <Route path={routers.STORES.PRODUCT_MANAGEMENT} element={<ProductManagementPage />} />
        <Route path={routers.STORES.RATE_MANAGEMENT} element={<RatingManagement />} />
        <Route path={routers.STORES.RATE_MANAGEMENT_DETAIL} element={<RatingDetail />} />
        <Route path={routers.STORES.ORDER_TRACKING} element={<OrderTracking />} />
        <Route path={routers.STORES.ORDER_TRACKING_DETAIL} element={<OrderDetailPage />} />
        <Route path={routers.STORES.REFUND_MANAGEMENT} element={<RefundManagementPage />} />
        <Route path={routers.STORES.REFUND_MANAGEMENT_DETAIL} element={<RefundDetailPage />} />
        <Route path={routers.STORES.VOUCHER_LIST} element={<VoucherListPage />} />
        <Route path={routers.STORES.VOUCHER_DETAIL} element={<VoucherDetailPage />} />
        <Route path={routers.STORES.CREATE_VOUCHER} element={<CreateAndUpdateVoucherPage />} />
        <Route path={routers.STORES.EDIT_VOUCHER} element={<CreateAndUpdateVoucherPage />} />
        <Route path={routers.MERCHANT_ONBOARD} element={<MerchantOnBoard />} />
        <Route path={routers.NOTIFICATION} element={<NotificationPage />} />
        <Route path={"/icons"} element={<Icons />} />
      </Routes>
    );
  }
};

export default Routers;
