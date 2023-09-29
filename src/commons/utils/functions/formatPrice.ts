import { FormInstance } from "antd";
import BigNumber from "bignumber.js";

export const formatPrice = (price: number) => {
  return "S$ " + new Intl.NumberFormat("en-US", { maximumSignificantDigits: 3 }).format(price);
};

type IBigNumberArg = string | number | BigNumber;

export const formatRoundFloorDisplay = (value: IBigNumberArg, decimalPlace = 4, shiftedBy = 0): string => {
  return new BigNumber(value || 0).shiftedBy(-shiftedBy).decimalPlaces(decimalPlace, BigNumber.ROUND_FLOOR).toFormat();
};

export const format2Digit = (value: string | number) => {
  return new BigNumber(value).toFormat(2, 1);
};

export const format2DigitValueForm = (value: string | number, form: FormInstance, name: string) => {
  const formatedNumber = new BigNumber(value).toFormat(2, 1);
  form.setFieldValue(name, formatedNumber);
};

export const formatLP = (value: string | number) => {
  return Math.round(Number(value));
};

export const roundedAndFormatNumber = (number: string | number) => {
  return Math.round((Number(number) * 100) / 100).toFixed(2);
};
