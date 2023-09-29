import jwtDecode from "jwt-decode";
import { MERCHANT, TOKEN_KEY } from "../../constants";

export const getUserFromToken = (): UserDecode | null => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    const user = jwtDecode(token) as UserDecode;
    if (user.exp < Date.now() / 1000) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return user;
  } catch {
    return null;
  }
};
export const getMerchantLocal = (): User | null => {
  try {
    const userStringify = localStorage.getItem(MERCHANT);
    if (!userStringify) return null;
    const user = JSON.parse(userStringify) as User;
    if (!user.id) {
      localStorage.removeItem(MERCHANT);
      return null;
    }
    return user;
  } catch {
    return null;
  }
};
