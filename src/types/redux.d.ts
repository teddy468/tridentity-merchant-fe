declare type PayloadAction<P = void> = import("@reduxjs/toolkit").PayloadAction<P>;

declare interface CallbackPayload<P = any, R = any, E = any> {
  payload: P;
  onSuccess?: (result: R) => void;
  onError?: (error: E) => void;
}

declare interface CallbackAction<P = void, R = any, E = any> extends PayloadAction<CallbackPayload<P, R, E>> {}

declare type RootState = import("../redux/store").RootState;

declare type AppDispatch = import("../redux/store").AppDispatch;
