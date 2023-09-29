import { COMPANY_NAME_PATTERN, EMAIL_PATTERN, PHONE_NUMBER_PATTERN } from ".";

export const AccountInformationFormFields = [
  {
    title: "Company name",
    placeholder: "Enter Company name",
    name: "company_name",
    rule: [
      {
        required: true,
        message: "This field is required",
        whitespace: true,
      },
      {
        pattern: COMPANY_NAME_PATTERN,
        message: "Invalid Company Name",
      },
    ],
  },
  {
    title: "Email address",
    placeholder: "Enter Email address",
    name: "email",
    rule: [
      {
        required: true,
        message: "This field is required",
        whitespace: true,
      },
      {
        pattern: EMAIL_PATTERN,
        message: "Invalid email",
      },
    ],
  },
  {
    title: "Phone number",
    placeholder: "Enter Phone number",
    name: "phone",
    rule: [
      {
        required: true,
        message: "This field is required",
      },
      {
        pattern: PHONE_NUMBER_PATTERN,
        message: "Invalid phone number",
      },
    ],
  },
  // {
  //   title: "Choose business categories",
  //   placeholder: "Choose business categories",
  //   name: "category_ids",
  //   rule: [{ required: true, message: "This field is required" }],
  // },
  {
    title: "Upload business document(s)",
    placeholder: "Upload business document(s)",
    name: "documents",
    rule: [{ required: true, message: "This field is required" }],
  },
  {
    type: "text",
    title: "Registered Office Address",
    placeholder: "Enter Registered Office Address",
    name: "registeredOfficeAddress",
    rule: [
      {
        required: true,
        message: "This field is required",
        whitespace: true,
      },
    ],
  },
  {
    type: "number",
    title: "SFA Number",
    placeholder: "Enter SFA Number",
    name: "sfaNumber",
    rule: [
      {
        required: true,
        message: "This field is required",
        whitespace: true,
      },
    ],
  },
  {
    type: "number",
    title: "GST Registration Number",
    placeholder: "Enter GST Registration Number",
    name: "gstRegistrationNumber",
    rule: [
      {
        required: true,
        message: "This field is required",
        whitespace: true,
      },
    ],
  },
  {
    type: "text",
    title: "Representative Name",
    placeholder: "Enter Representative Name",
    name: "representativeName",
    rule: [
      {
        required: true,
        message: "This field is required",
        whitespace: true,
      },
    ],
  },
  {
    type: "number",
    title: "Repersentative Mobile ",
    placeholder: "Enter Repersentative Mobile Phone",
    name: "contactMobileNo",
    rule: [
      {
        required: true,
        message: "This field is required",
        whitespace: true,
      },
    ],
  },
  {
    type: "number",
    title: "Office No",
    placeholder: "Enter Office No",
    name: "contactOfficeNo",
    rule: [
      {
        required: true,
        message: "This field is required",
        whitespace: true,
      },
    ],
  },
  {
    type: "text",
    title: "Territory",
    placeholder: "Enter Territory",
    name: "territory",
    rule: [
      {
        required: true,
        message: "This field is required",
        whitespace: true,
      },
    ],
  },
  {
    type: "text",
    title: "Bussiness Nature",
    placeholder: "Enter Bussiness Nature",
    name: "businessNature",
    rule: [
      {
        required: true,
        message: "This field is required",
        whitespace: true,
      },
    ],
  },
  {
    type: "text",
    title: "Email Address",
    placeholder: "Enter Email Address",
    name: "contactEmailAddress",
    rule: [
      {
        required: true,
        message: "This field is required",
        whitespace: true,
      },
      {
        pattern: EMAIL_PATTERN,
        message: "Invalid email",
      },
    ],
  },
  {
    type: "text",
    title: "Finance Representative Name",
    placeholder: "Enter Finance Representative Name",
    name: "financeRepresentativeName",
    rule: [
      {
        required: true,
        message: "This field is required",
        whitespace: true,
      },
    ],
  },
  {
    type: "number",
    title: "Office No",
    placeholder: "Enter Office No",
    name: "bankOfficeNo",
    rule: [
      {
        required: true,
        message: "This field is required",
        whitespace: true,
      },
    ],
  },
  {
    type: "number",
    title: "Mobile No",
    placeholder: "Enter Mobile No",
    name: "bankMobileNo",
    rule: [
      {
        required: true,
        message: "This field is required",
        whitespace: true,
      },
    ],
  },
  {
    type: "text",
    title: "Email Address",
    placeholder: "Enter Email Address",
    name: "bankEmailAddress",
    rule: [
      {
        required: true,
        message: "This field is required",
        whitespace: true,
      },
      {
        pattern: EMAIL_PATTERN,
        message: "Invalid email",
      },
    ],
  },
  {
    type: "text",
    title: "Bank Name",
    placeholder: "Enter Bank Name",
    name: "bankName",
    rule: [{ required: true, message: "This field is required", whitespace: true }],
  },
  {
    type: "number",
    title: "Account Number",
    placeholder: "Enter Bank Account Number",
    name: "accountNo",
    rule: [{ required: true, message: "This field is required", whitespace: true }],
  },
  {
    type: "text",
    title: "Account Name",
    placeholder: "Enter Bank Account Name",
    name: "accountName",
    rule: [{ required: true, message: "This field is required", whitespace: true }],
  },
];
