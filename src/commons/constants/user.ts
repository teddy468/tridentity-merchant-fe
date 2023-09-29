export enum MODES {
  ADMIN = 1,
  USER = 2,
}

export enum GENDERS {
  OTHER = 0,
  MALE = 1,
  FEMALE = 2,
}
export const PREFIXES = [
  { value: "+65", label: "+65" },
  { value: "+84", label: "+84" },
];

export enum RejectedFieldUpdate {
  EMAIL = "EMAIL",
  CATEGORY = "CATEGORY",
  PHONE = "PHONE",
  NAME = "NAME",
  DOCUMENTS = "DOCUMENTS",
  REGISTERED_OFFICE_ADDRESS = "REGISTERED_OFFICE_ADDRESS",
  SFA_NUMBER = "SFA_NUMBER",
  GST_REGISTRATION_NUMBER = "GST_REGISTRATION_NUMBER",
  REPRESENTATIVE_NAME = "REPRESENTATIVE_NAME",
  CONTACT_OFFICE_NO = "CONTACT_OFFICE_NO",
  CONTACT_MOBILE_NO = "CONTACT_MOBILE_NO",
  CONTACT_EMAIL_ADDRESS = "CONTACT_EMAIL_ADDRESS",
  TERRITORY = "TERRITORY",
  BUSINESS_NATURE = "BUSINESS_NATURE",
  FINANCE_REPRESENTATIVE_NAME = "FINANCE_REPRESENTATIVE_NAME",
  BANK_OFFICE_NO = "BANK_OFFICE_NO",
  BANK_MOBILE_NO = "BANK_MOBILE_NO",
  BANK_EMAIL_ADDRESS = "BANK_EMAIL_ADDRESS",
  BANK_NAME = "BANK_NAME",
  ACCOUNT_NAME = "ACCOUNT_NAME",
  ACCOUNT_NO = "ACCOUNT_NO",
}

export const objecFieldsRejected = {
  NAME: "company_name",
  EMAIL: "email",
  PHONE: "phone",
  CATEGORY: "category_ids",
  DOCUMENT: "documents",
  //
  REGISTERED_OFFICE_ADDRESS: "registeredOfficeAddress",
  SFA_NUMBER: "sfaNumber",
  GST_REGISTRATION_NUMBER: "gstRegistrationNumber",
  REPRESENTATIVE_NAME: "representativeName",
  CONTACT_OFFICE_NO: "contactOfficeNo",
  CONTACT_EMAIL_ADDRESS: "contactEmailAddress",
  TERRITORY: "territory",
  BUSINESS_NATURE: "businessNature",
  CONTACT_MOBILE_NO: "contactMobileNo",
  //
  FINANCE_REPRESENTATIVE_NAME: "financeRepresentativeName",
  BANK_OFFICE_NO: "bankOfficeNo",
  BANK_MOBILE_NO: "bankMobileNo",
  BANK_EMAIL_ADDRESS: "bankEmailAddress",
  BANK_NAME: "bankName",
  ACCOUNT_NAME: "accountName",
  ACCOUNT_NO: "accountNo",
};
