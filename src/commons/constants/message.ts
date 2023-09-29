export const UNKNOW = "Something is wrong. Please try again later!";

export enum EMAIL {
  REQUIRED = "Email address is required",
  EXISTS = "Email address is exists",
  NOT_EXISTS = "Email address is not exists",
  FORMAT = "Email address is incorrect format",
}

export enum PASSWORD {
  REQUIRED = "Password is required",
  INCORRECT = "Password is incorrect",
  FORMAT = "Email address is incorrect format",
  SUCCESS = "Update pasword successfuly",
}

export enum FIRST_NAME {
  REQUIRED = "First name is required",
  EXISTS = "First name is exists",
  FORMAT = "First name is incorrect format",
}

export enum LAST_NAME {
  REQUIRED = "Last name is required",
  EXISTS = "Last name is exists",
  FORMAT = "Last name is incorrect format",
}

export enum LOGIN {
  SUCCESS = "Login success",
  FAILED = "Email or password is incorrect",
}

export enum IMAGE {
  NOT_EXCEED_2MB = "Image cannot exceed 2MB",
  NOT_ALLOW_TYPE_FILE = "Users can not upload the type file other svg, png, jpg",
  NOT_MATCH_RATIO = "Image aspect ratio must be 3:2",
}

export enum VIDEO {
  NOT_EXCEED_30MB = "Video cannot exceed 30MB",
  NOT_EXCEED_RESOLUTION_1280 = "Maximum resolution is 1280x1280px",
  NOT_ALLOW_TYPE_FILE = "Only file *.mp4 is allowed",
  DURATION = "Video duration must be from 10 to 60 seconds",
}
