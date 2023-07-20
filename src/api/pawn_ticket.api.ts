import axios from "axios";
import { PawnTickets, ILoginResponse } from "./types";

const BASE_URL = "https://pm55.corsivalab.xyz/trustGroup/public/api";

export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
authApi.defaults.headers.common["Content-Type"] = "application/json";
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

export async function fetchPawnTickets(): Promise<PawnTickets[]> {
  const response = await authApi.get(`${BASE_URL}/users`);
  return response.data.data;
}

export async function createPawnTicket(pawnTicket: PawnTickets): Promise<void> {
  const formData = new FormData();
  formData.append("user_id", pawnTicket.user_id);
  formData.append("date_time", pawnTicket.date_time.toISOString());
  formData.append("details", pawnTicket.details);

  await authApi.post(`${BASE_URL}/pawn-tickets`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function updatePawnTicket(pawnTicket: PawnTickets): Promise<void> {
  const formData = new FormData();
  formData.append("_method", "PUT");
  formData.append("user_id", pawnTicket.user_id);
  formData.append("date_time", pawnTicket.date_time.toISOString());
  formData.append("details", pawnTicket.details);

  await authApi.post(`${BASE_URL}/pawn-tickets/${pawnTicket.id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function deletePawnTicket(pawnTicketId: string): Promise<void> {
  await authApi.delete(`${BASE_URL}/pawn-tickets/${pawnTicketId}`);
}
