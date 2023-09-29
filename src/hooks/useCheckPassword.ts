import React from "react";

export enum PasswordStrength {
  Weak = 0,
  Medium = 1,
  Strong = 2,
}
const useCheckPassword = () => {
  const [passwordStrength, setPasswordStrength] = React.useState<PasswordStrength | undefined>();

  const regex6To20char = new RegExp("^.{6,20}$");
  const regex8To20charNumAndLet = new RegExp("(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{8,20})$");
  const regexStrongPassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");

  const checkPasswordStrength = (password: string) => {
    switch (password) {
      case password.length === 0 ? password : "":
        return setPasswordStrength(undefined);

      case regexStrongPassword.test(password) ? password : "":
        return setPasswordStrength(PasswordStrength.Strong);

      case regex8To20charNumAndLet.test(password) ? password : "":
        return setPasswordStrength(PasswordStrength.Medium);

      case regex6To20char.test(password) ? password : "":
        return setPasswordStrength(PasswordStrength.Weak);

      default:
        return setPasswordStrength(PasswordStrength.Weak);
    }
  };

  return { passwordStrength, checkPasswordStrength };
};

export default useCheckPassword;
