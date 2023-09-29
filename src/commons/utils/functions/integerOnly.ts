import { FormInstance } from "antd";
import { ChangeEvent } from "react";
import { LETTER_REGEX, LETTER_REGEX_ALLOW_DECIMAL } from "../../constants";
// used in Form.Item, remember to set type="number"
export const integerOnlyInput = (event: any) => {
  if (
    event.key === "." ||
    event.key === "-" ||
    event.key === "," ||
    event.key === "e" ||
    event.key === "+" ||
    event.key === "E"
  ) {
    event.preventDefault();
  }
};

export const decimalOnlyInput = (event: any) => {
  if (event.key === "-" || event.key === "," || event.key === "e" || event.key === "+" || event.key === "E") {
    event.preventDefault();
  }
};

// used in Form.Item, remember to set type="number"
export const filterECharacterInputNumber = (
  fieldName: string | (string | number)[],
  form: FormInstance<any>,
  event: ChangeEvent<HTMLInputElement>
) => {
  form.setFieldValue(fieldName, event.target.value.replace(LETTER_REGEX, ""));
};

export const filterECharacterInputDecimal = (
  fieldName: string | (string | number)[],
  form: FormInstance<any>,
  event: ChangeEvent<HTMLInputElement>
) => {
  form.setFieldValue(fieldName, event.target.value.replace(LETTER_REGEX_ALLOW_DECIMAL, ""));
};
