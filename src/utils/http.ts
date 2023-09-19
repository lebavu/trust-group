import axios, { AxiosError, type AxiosInstance } from "axios";
import HttpStatusCode from "@/constants/httpStatusCode.enum";
import { toast } from "react-toastify";
import { AuthResponse } from "@/types/auth.type";
import {
  clearLS,
  getAccessTokenFromLS,
  setAccessTokenToLS,
  setProfileToLS,
  getProfileFromLS
} from "./auth";
import config from "src/constants/config";
import { URL_LOGIN, URL_LOGOUT, URL_REGISTER } from "@/api/auth.api";
import { isAxiosUnauthorizedError } from "./utils";
import { ErrorResponse } from "src/types/utils.type";

export class Http {
  instance: AxiosInstance;
  private accessToken: string;

  constructor() {
    this.accessToken = getAccessTokenFromLS();
    this.instance = axios.create({
      baseURL: config.baseUrl,
      // timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        // "expire-access-token": 60 * 60 * 24,
      },
    });
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
          return config;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    this.instance.interceptors.response.use(
      async (response) => {
        const { url } = response.config;
        if (url === URL_LOGIN || url === URL_REGISTER) {
          const data = response.data as AuthResponse;
          this.accessToken = data.token;
          setAccessTokenToLS(this.accessToken);
          await this.getInfoUser();
        } else if (url === URL_LOGOUT) {
          this.accessToken = "";
          clearLS();
        }
        return response;
      },
      (error: AxiosError) => {
        if (![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)) {
          const data: any | undefined = error.response?.data;
          const message = data?.message || error.message;
          toast.error(message);
        }

        if (isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error)) {
          clearLS();
          this.accessToken = "";
          toast.error(error.response?.data.data?.message || error.response?.data.message);
          // window.location.reload();
        }
        return Promise.reject(error);
      }
    );
  }
  private async getInfoUser() {
    try {
      const userInfo = getProfileFromLS();
      setProfileToLS(userInfo);
    } catch (error) {
      console.error("Error while fetching user info:", error);
    }
  }
}

const http = new Http().instance;
export default http;
