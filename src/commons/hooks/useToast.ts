import { toast } from "react-toastify";
import { ToastOptions } from "react-toastify/dist/types";

type ToastFn = (message: React.ReactNode, duration?: number) => void;

interface ReturnType {
  error: ToastFn;
  success: ToastFn;
  warning: ToastFn;
  info: ToastFn;
}

const useToast = (): ReturnType => {

  const createToast =
    (severity: string): ToastFn =>
      (message: React.ReactNode, duration: number = 3000) => {
        const option: ToastOptions<{}> = {
          position: "top-right",
          autoClose: duration,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        };
        switch (severity) {
          case "success":
            toast.success(message, option);
            break;
          case "error":
            toast.error(message, option);
            break;
          case "warning":
            toast.warning(message, option);
            break;
          default:
            toast.info(message, option);
            break;
        }

      };

  return {
    error: createToast("error"),
    success: createToast("success"),
    warning: createToast("warning"),
    info: createToast("info"),
  };
};

export default useToast;
