import axios from "axios";
import { Branch } from "./types";

const BASE_URL = "https://pm55.corsivalab.xyz/trustGroup/public/api";

export async function fetchBranches(): Promise<Branch[]> {
  const response = await axios.get(`${BASE_URL}/branches`);
  return response.data.data;
}

export async function createBranch(branch: Branch): Promise<void> {
  const formData = new FormData();
  formData.append("name", branch.name);
  formData.append("address", branch.address);
  formData.append("image", branch.image_url);

  await axios.post(`${BASE_URL}/branches`, formData, {
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

  await axios.post(`${BASE_URL}/branches/${branch.id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function deleteBranch(branchId: string): Promise<void> {
  await axios.delete(`${BASE_URL}/branches/${branchId}`);
}
