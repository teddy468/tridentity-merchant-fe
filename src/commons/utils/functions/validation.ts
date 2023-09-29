import { ValidatorRule } from "rc-field-form/lib/interface";
export const isPositiveInteger =
  (name: string): ValidatorRule["validator"] =>
  async (_, value = "") => {
    if (value !== "" && !/^[1-9]\d*$/.test(value.toString()))
      return Promise.reject(new Error(`${name} must be a positive integer`));
    return Promise.resolve();
  };

export const isPositiveNumber =
  (name: string): ValidatorRule["validator"] =>
  async (_, value = "") => {
    if (value === "" || Number(value) > 0) return Promise.resolve();
    return Promise.reject(new Error(`${name} must be a positive number`));
  };

export const isPositiveNumberOrZero =
  (name: string): ValidatorRule["validator"] =>
  async (_, value = "") => {
    if (value === "" || Number(value) >= 0) return Promise.resolve();
    return Promise.reject(new Error(`${name} must be a positive number`));
  };

export const isValidAddress =
  (latLng: StoreAddress["coordinate"] | null): ValidatorRule["validator"] =>
  async (_, value) => {
    if (!value || (latLng?.lat && latLng?.lng)) return Promise.resolve();
    return Promise.reject(new Error(`Address invalid`));
  };
