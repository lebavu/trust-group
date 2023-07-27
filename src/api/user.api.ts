import http from "@/utils/http";
import { User } from "./types";

export async function fetchUsers(): Promise<User[]> {
  const response = await http.get("users");
  // const accessToken = response.data.token;
  // localStorage.setItem("token", accessToken);
  return response.data.data;
}

export async function createUser(user: User): Promise<void> {
  const formData = new FormData();
  formData.append("name", user.name);
  formData.append("email", user.email);
  formData.append("handphone_number", user.handphone_number);
  formData.append("profile_image", user.profile_image);
  formData.append("password", user.password);
  formData.append("role_id", user.role_id);

  await http.post("users", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function updateUser(user: User): Promise<void> {
  const formData = new FormData();
  formData.append("_method", "PUT");
  formData.append("name", user.name);
  formData.append("email", user.email);
  formData.append("handphone_number", user.handphone_number);
  formData.append("password", user.password);
  formData.append("profile_image", user.profile_image);
  formData.append("role_id", user.role_id);

  await http.post(`users/${user.id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function deleteUser(userId: string): Promise<void> {
  await http.delete(`users/${userId}`);
}
