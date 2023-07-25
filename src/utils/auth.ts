import { User } from "@/types/user.type";

export const LocalStorageEventTarget = new EventTarget();

export const setAccessTokenToLS = (token: string) => {
  localStorage.setItem("token", token);
};

export const clearLS = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userInfo");
  const clearLSEvent = new Event("clearLS");
  LocalStorageEventTarget.dispatchEvent(clearLSEvent);
};

export const getAccessTokenFromLS = () => localStorage.getItem("token") || "";

export const getProfileFromLS = () => {
  const result = localStorage.getItem("userInfo");
  if (result) {
    try {
      return JSON.parse(result);
    } catch (error) {
      console.error("Error parsing user profile from local storage:", error);
    }
  }
  return null; // or return an empty object {} instead if you prefer
};



export const setProfileToLS = (user: User) => {
  localStorage.setItem("userInfo", JSON.stringify(user));
};