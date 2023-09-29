export const TOKEN_KEY = "merchant_token";
export const REFRESH_TOKEN_KEY = "merchant_refresh_token";
export const BASE_URL = process.env.REACT_APP_BASE_URL as string;
export const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string;
export const CURRENT_STORE = "current_store";
export const MERCHANT = "merchant";

export const ALL = "all";

export const IMAGE_TYPE_ALLOW = {
  SVG: "image/svg+xml",
  JPG: "image/jpg",
  JPEG: "image/jpeg",
  PNG: "image/png",
  MP4: "video/mp4",
};

export const COMPANY_NAME_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9.\s]*$/;
export const EMAIL_PATTERN =
  /^[a-zA-Z0-9](?=[a-zA-Z0-9.]{5,29}@)[a-zA-Z0-9]*(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // various domains allowed (gmail.com, yahoo.com ...)
export const PHONE_NUMBER_PATTERN = /^\.*[6|8|9]\d{7}$/gm;
export const PHONE_NUMBER_VIETNAM = /([3|5|7|8|9])+([0-9]{8})\b/g;
export const LETTER_REGEX = /[a-zA-ZÀ-Ỹà-ỹ!@#$%^&*()\[\]{}\-+=_`~ |;:'",.<>/?\\]/g;
export const LETTER_REGEX_ALLOW_DECIMAL = /[a-zA-ZÀ-Ỹà-ỹ!@#$%^&*()\[\]{}\-+=_`~ |;:'",<>/?\\]/g;

export function getCurrentPattern(region: string | undefined) {
  if (!region) return PHONE_NUMBER_PATTERN;
  switch (region) {
    case "+84":
      return PHONE_NUMBER_VIETNAM;
    default:
      return PHONE_NUMBER_PATTERN;
  }
}
