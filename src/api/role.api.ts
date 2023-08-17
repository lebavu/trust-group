import http from "@/utils/http";
import { Role } from "./types";

export async function fetchRoles(): Promise<Role[]> {
  const response = await http.get("roles");
  return response.data.data;
}

export async function createRole(role: Role): Promise<void> {
  await http.post("roles", role );
}

export async function updateRole(role: Role): Promise<void> {
  await http.put(`roles/${role.id}`, role);
}

export async function deleteRole(roleId: string): Promise<void> {
  await http.delete(`roles/${roleId}`);
}
