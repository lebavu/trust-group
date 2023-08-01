import http from "@/utils/http";
import { Branch } from "./types";

export async function fetchBranches(): Promise<Branch[]> {
  const response = await http.get("branches");
  return response.data.data;
}

export async function createBranch(branch: Branch): Promise<void> {
  const formData = new FormData();
  formData.append("name", branch.name);
  formData.append("address", branch.address);
  formData.append("image", branch.image_url);

  await http.post("branches", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function updateBranch(branch: Branch): Promise<void> {
  const formData = new FormData();
  formData.append("_method", "PUT");
  formData.append("name", branch.name);
  formData.append("address", branch.address);
  formData.append("image", branch.image_url);

  await http.post(`branches/${branch.id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function deleteBranch(branchId: string): Promise<void> {
  await http.delete(`branches/${branchId}`);
}
