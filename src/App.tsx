import "./index.css";
import "antd/dist/reset.css";
import { BrowserRouter } from "react-router-dom";
import AppContainer from "./AppContainer";
import Routers from "./Routers";
import { AppProvider } from "./contexts/AppContext";
import { ConfigProvider } from "antd";
import palette from "./themes/palette";
import typography from "./themes/typography";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BigNumber from "bignumber.js";

BigNumber.config({
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
  EXPONENTIAL_AT: [-50, 50],
});

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: palette.primary[800],
          fontFamily: typography.fontFamily,
        },
      }}
    >
      <BrowserRouter>
        <AppProvider>
          <AppContainer>
            <ToastContainer/>
            <Routers />
          </AppContainer>
        </AppProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
