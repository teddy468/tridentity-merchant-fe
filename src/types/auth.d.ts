type CodeResponse = import("@react-oauth/google").CodeResponse;
declare interface RegisterBody {
  username: string;
  email: string;
  password: string;
  terms: boolean;
}

declare interface RegisterResponse {
  user: UserInfo;
}

declare interface RegisterError extends ResponseError {}

declare interface LoginBody {
  identifier: string;
  password: string;
}

declare interface RegisterValues extends RegisterBody {
  repassword: string;
}

declare interface ProfileBody {
  fullName: string;
  avatar: string;
}
declare interface LoginResponse {
  email: string;
  access_token: string;
  refresh_token: string;
  first_name: string;
  last_name: string;
  phone: string;
  status: number;
  id: string;
  identifier: string;
  create_time: string;
  update_time: string;
  last_login_at: string;
  merchantIds: number[];
  merchant_role: Role;
  merchantStoreAuthorities: merchantStoreAuthorities[];
}

declare interface UseLoginGoogleResponse extends Omit<CodeResponse, "error" | "error_description" | "error_uri"> {}

declare interface LoginGoogleResponse {
  access_token: string;
  refresh_token: string;
}

declare interface LoginError extends ResponseError {}

declare interface LogoutBody {
  refresh_token: string;
}

declare interface LogoutResponse {}

declare interface LogoutError {}

declare interface RefreshTokenBody {
  refresh_token: string;
}

declare interface RefreshTokenResponse {
  success: boolean;
  access_token: string;
}

declare interface refresh_tokenError {}

declare interface VerifyEmailResponse extends UserInfo {
  roles: Role[];
}

declare interface VerifyEmailError extends ResponseError {}

declare interface UpdateUserBasicBody {
  username: string;
  avatar: string;
}

declare interface UpdatePasswordValues {
  currentPassword: string;
  repassword: string;
  newPassword: string;
}

declare interface UpdatePasswordBody {
  newPassword: string;
}
declare interface UpdatePasswordError extends ResponseError {}

declare interface UpdateUserBasicValues extends Omit<UpdateUserBasicBody, "avatar"> {
  avatar: FileList;
}

declare interface UpdateUserBasicResponse extends UserInfo {}

declare interface UpdateUserBasicError extends ResponseError {}

declare interface UpdatePasswordError extends ResponseError {}

declare interface putUpdatePreferencesError extends ResponseError {}

declare interface ResetPasswordFormBody {
  newPassword: string;
  confirmNewPassword: string;
}

declare interface MerchantOnboardRequestBody {
  company_name: string;
  email: string;
  phone: string;
  category_ids: string;
  documents: File[];
}
declare interface MerchantOnboardRequestResponse {
  id: string;
  company_name: string;
  email: string;
  phone: string;
  category_ids: string[];
  documents: string[];
  status: string;
  create_time: string;
  update_time: string;
}

declare interface SignUpFormBody {
  company_name: string;
  email: string;
  phone: number | string;
  // category_ids: string[];
  documents: File[];
  region: string;
}

declare interface SignUpFormBodyPart2 {
  registeredOfficeAddress: string;
  sfaNumber: string;
  gstRegistrationNumber: string;
  representativeName: string;
  contactOfficeNo: string;
  contactEmailAddress: string;
  territory: string;
  businessNature: string;
  contactMobileNo: string;
}

declare interface SignUpFormBodyPart3 {
  financeRepresentativeName: string;
  bankOfficeNo: string;
  bankMobileNo: string;
  bankEmailAddress: string;
  bankName: string;
  accountName: string;
  accountNo: string;
}

declare interface AccountInformationForm extends SignUpFormBody, SignUpFormBodyPart2, SignUpFormBodyPart3 {}

declare interface AccountInformation extends SignUpFormBody {
  information: SignUpFormBody;
}
declare interface UpdateAccountInformationBody extends SignUpFormBody {
  documents: string[] | file[];
  logo: string;
  banner: string[];
  settings: {
    is_highlight: true;
  };
  merchantContact: SignUpFormBodyPart2;
  merchantBankDetail: SignUpFormBodyPart3;
  name: string;
  phoneCode: string;
}
declare interface SetPasswordResponse {
  id: string;
  identifier: string;
  email: string;
  last_login_at: string;
}
