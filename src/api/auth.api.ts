import axios from "axios";
import { LoginInput } from "../pages/Login/Login";
import { RegisterInput } from "../pages/SignUp/SignUp";
import { GenericResponse, ILoginResponse, IUserResponse } from "./types";

const BASE_URL = "https://pm55.corsivalab.xyz/trustGroup/public/api";

export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

authApi.defaults.headers.common["Content-Type"] = "application/json";
// const token = localStorage.getItem("token");
// if (token) {
//   authApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
// }
// export const refreshAccessTokenFn = async () => {
//   const response = await authApi.get<ILoginResponse>("refresh");
//   return response.data;
// };
export const refreshAccessTokenFn = async () => {
  const response = await authApi.get<ILoginResponse>("refresh");
  const accessToken = response.data.token;
  localStorage.setItem("token", accessToken);
  return response.data;
};

authApi.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const errMessage = error.response.data.message as string;
    if (errMessage.includes("not logged in") && !originalRequest._retry) {
      originalRequest._retry = true;
      await refreshAccessTokenFn();
      return authApi(originalRequest);
    }
    if (error.response.data.message.includes("not refresh")) {
      document.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const signUpUserFn = async (user: RegisterInput) => {
  const response = await authApi.post<GenericResponse>("register", user);
  return response.data;
};

export const loginUserFn = async (user: LoginInput) => {
  const response = await authApi.post<ILoginResponse>("login", user);
  // const accessToken = response.data.token;
  // localStorage.setItem("token", accessToken);
  return response.data;
};

export const verifyEmailFn = async (verificationCode: string) => {
  const response = await authApi.get<GenericResponse>(
    `verifyemail/${verificationCode}`
  );
  return response.data;
};

export const logoutUserFn = async () => {
  const response = await authApi.get<GenericResponse>("logout");
  return response.data;
};

export const getMeFn = async () => {
  const response = await authApi.get<IUserResponse>("get-info-user");
  return response.data;
};
export const forgotPasswordFn = async () => {
  const response = await authApi.post<GenericResponse>("forgot-password");
  return response.data;
};

// export const resetPasswordFn = async (data: ResetPasswordInput, resetCode: string) => {
//   const response = await authApi.patch<GenericResponse>(`auth/resetpassword/${resetCode}`, data);
//   return response.data;
// };