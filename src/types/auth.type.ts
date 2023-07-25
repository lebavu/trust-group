import { User } from "@/types/user.type";
export interface AuthResponse {
  status: string;
  token: string;
  expires: number;
  userInfo: User;
};

