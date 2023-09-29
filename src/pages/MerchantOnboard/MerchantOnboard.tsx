import { message } from "antd";
import { AxiosResponse } from "axios";
import { FC, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { MERCHANT_OBBOARD_REQUEST_VERIFY, MERCHANT_ONBOARD_SET_PASSWORD } from "../../commons/constants/api-urls";
import { routers } from "../../commons/constants/routers";
import defaultAxios from "../../commons/utils/axios";
import SetPasswordForm from "../../components/Form/SetPassword";
import VerifyOTP from "../../components/Form/VerifyOTP/VerifyOTP";

const MerchantOnBoard: FC = () => {
  const { merchantOnboardId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const name = searchParams.get("name");
  const [openVerifyOTP, setOpenVerifyOTP] = useState<boolean>(false);
  const [openSetPassword, setOpenSetPassword] = useState<boolean>(false);
  const [activeToken, setActiveToken] = useState("");

  const requestVerifyOTP = async (merchantOnboardId: string) => {
    try {
      const res: AxiosResponse<any> = await defaultAxios.get(MERCHANT_OBBOARD_REQUEST_VERIFY(merchantOnboardId));
      if (!!res?.data) {
        setOpenVerifyOTP(true);
      }
    } catch (error) {
      message.error("request verify otp failed");
    }
  };

  const setPassword = async (values: ResetPasswordFormBody) => {
    try {
      const res: AxiosResponse<SetPasswordResponse> = await defaultAxios.post(MERCHANT_ONBOARD_SET_PASSWORD, {
        new_password: values.newPassword,
        activate_token: activeToken,
      });
      if (res?.data?.id) {
        navigate(routers.LOGIN);
      }
    } catch (error) {
      message.error("set password failed");
    }
  };

  const onVerifyOTPSuccess = (activate_token: string) => {
    setActiveToken(activate_token);
    setOpenSetPassword(true);
    setOpenVerifyOTP(false);
  };

  useEffect(() => {
    if (merchantOnboardId) {
      requestVerifyOTP(merchantOnboardId);
    }
  }, [merchantOnboardId]);

  return (
    <div>
      <VerifyOTP
        merchantOnboardId={merchantOnboardId || ""}
        open={openVerifyOTP}
        setOpen={setOpenVerifyOTP}
        name={name || ""}
        email={email || ""}
        onSuccess={onVerifyOTPSuccess}
      />
      {openSetPassword && <SetPasswordForm onReset={setPassword} confirmText="Confirm" />}
    </div>
  );
};

export default MerchantOnBoard;
