import React from "react";
import { PasswordStrength } from "../../hooks/useCheckPassword";
import styles from "./styles.module.scss";

interface Props {
  passwordStrength?: PasswordStrength;
  active?: boolean;
}

const ChildWeak: React.FC<Props> = ({ passwordStrength, active }) => {
  const getStyle = () => {
    switch (passwordStrength) {
      case PasswordStrength.Weak:
        return styles.red;
      case PasswordStrength.Medium:
        return styles.yellow;
      case PasswordStrength.Strong:
        return styles.green;
      default:
        return styles.default;
    }
  };
  return <div className={`${styles.child} ${active && styles.active}  ${getStyle()}`}></div>;
};
const ChildMedium: React.FC<Props> = ({ passwordStrength }) => {
  const getStyle = () => {
    switch (passwordStrength) {
      case PasswordStrength.Medium:
        return styles.yellow;
      case PasswordStrength.Strong:
        return styles.green;
      default:
        return styles.default;
    }
  };

  return (
    <div
      className={`${styles.child} ${
        (passwordStrength === PasswordStrength.Medium || passwordStrength === PasswordStrength.Strong) && styles.active
      } ${getStyle()}`}
    ></div>
  );
};
const ChildStrong: React.FC<Props> = ({ passwordStrength }) => {
  const getStyle = () => {
    if (passwordStrength === PasswordStrength.Strong) {
      return styles.green;
    } else {
      return styles.default;
    }
  };

  return (
    <div
      className={`${styles.child} ${passwordStrength === PasswordStrength.Strong && styles.active} ${getStyle()}`}
    ></div>
  );
};

const PasswordStrengthBar: React.FC<Props> = ({ passwordStrength, active }) => {
  return (
    <div className={styles.strengthBarBox}>
      <div className={`${styles.strengthBar}`}>
        <ChildWeak passwordStrength={passwordStrength} active={active} />
      </div>
      <div className={`${styles.strengthBar}`}>
        <ChildMedium passwordStrength={passwordStrength} />
      </div>
      <div className={`${styles.strengthBar} `}>
        <ChildStrong passwordStrength={passwordStrength} />
      </div>
    </div>
  );
};

export default PasswordStrengthBar;
