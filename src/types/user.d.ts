declare type MODES = import("../commons/constants/user").MODES;
declare type MODE_NAMES = import("../commons/constants/user").MODE_NAMES;
declare type GENDERS = import("../commons/constants/user").GENDERS;

declare interface Role {
  id: MODES;
  name: string;
  status: string;
  description: string;
  create_time: string | Date;
  update_time: string | Date;
}

declare interface User {
  identifier: string;
  address: string;
  avatar: string;
  email: string;
  first_name: string;
  full_name: string;
  id: string;
  last_name: string;
  phone: string;
  status: number;
  user_oauthid: string;
  username: string;
  date_of_birth: string;
  gender: number;
  preferences: Preferences[];
  merchantIds: number[];
  merchant_role: Role;
  merchantStoreAuthorities: merchantStoreAuthorities[];
}

interface merchantStoreAuthorities {
  id: number;
  merchant_id: number;
  merchant_user_id: number;
  merchant_store_id: number;
  role_id: number;
  merchantStore: Store;
}

interface Preferences {
  id: number;
  name: string;
}

declare interface PaymentCard {
  id: number;
  userid: string;
  card_no: string;
  exp_date: string;
  payer_name: string;
  card_type: string;
  create_time: string;
  update_time: string;
}
declare interface UserDecode {
  exp: number;
  iat: string;
}

declare interface GetUserInfoResponse extends User {}

declare interface GetUserInfoError {}

declare interface UpdatePasswordResponse {}
