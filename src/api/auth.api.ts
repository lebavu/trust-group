import { AuthResponse } from "@/types/auth.type";
import http from "@/utils/http";

export const URL_LOGIN = "login";
export const URL_REGISTER = "register";
export const URL_LOGOUT = "logout";
export const URL_GETINFOUSER = "get-info-user";
export const URL_REFRESH_TOKEN = "refresh-access-token";
export const URL_FORGOTPASSWORD = "forgot-password";
export const URL_RESETPASSWORD = "reset-password";

const authApi = {
  registerAccount(body: { email: string; password: string }) {
    return http.post<AuthResponse>(URL_REGISTER, body);
  },
  login(body: { email: string; password: string }) {
    return http.post<AuthResponse>(URL_LOGIN, body);
  },
  getInfoUser() {
    return http.get<AuthResponse, any>(URL_GETINFOUSER);
  },
  forgotPassword() {
    return http.post(URL_FORGOTPASSWORD);
  },
  logout() {
    return http.get(URL_LOGOUT);
  },
  resetPassword(body: { email: string; verified_code_forgot: string, password: string }) {
    return http.post(URL_RESETPASSWORD, body);
  }
};

export default authApi;
