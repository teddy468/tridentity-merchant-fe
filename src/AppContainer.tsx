import { FC, ReactNode, useContext, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { AppContext } from "./contexts/AppContext";
import CustomLayout from "./components/Layout/CustomLayout";
import { Loading } from "./commons/components/Loading";
import LoginLayout from "./components/Layout/LoginLayout";
import { NOT_FOUND, routers, titles } from "./commons/constants/routers";
import LayoutMerchantMember from "./components/Layout/CustomLayout/LayoutMerchantMember";

const AppContainer: FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useContext(AppContext);
  const { pathname } = useLocation();
  const publicRoutes = [
    routers.LOGIN,
    routers.RESET_PASSWORD,
    routers.SIGN_UP,
    routers.FORGOT_PASSWORD,
    routers.FORGOT_SUCCESS,
  ];

  useEffect(() => {
    document.title = Object.entries(titles).find(([key]) => pathname.includes(key))?.[1] || NOT_FOUND;
  }, [pathname]);

  if (!user && !publicRoutes.includes(pathname) && !pathname.includes("/merchant-onboard/accept")) {
    return <Navigate to={routers.LOGIN} state={{ from: pathname }} replace />;
  }

  if (user && !user.id) return <Loading />;

  if (user && pathname === routers.LOGIN) {
    return <Navigate to={routers.STORES.LIST} state={{ from: pathname }} replace />;
  }
  if (publicRoutes.includes(pathname) || pathname.includes("/merchant-onboard/accept")) {
    return <LoginLayout>{children}</LoginLayout>;
  }

  if (user?.merchant_role?.id === 1) {
    return <CustomLayout>{children}</CustomLayout>;
  } else {
    return <LayoutMerchantMember>{children}</LayoutMerchantMember>;
  }
};

export default AppContainer;
