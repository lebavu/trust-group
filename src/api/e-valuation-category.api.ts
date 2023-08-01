import http from "@/utils/http";
import { EValuationCategory } from "./types";

export async function fetchEValuationsCategories(): Promise<EValuationCategory[]> {
  const response = await http.get("e-valuation-categories");
  return response.data.data;
}

export async function createEValuationCategory(eValuationCategory: EValuationCategory): Promise<void> {
  const formData = new FormData();
  formData.append("name", eValuationCategory.name);
  formData.append("desc", eValuationCategory.desc);
  formData.append("parent", eValuationCategory.parent);

  await http.post("e-valuation-categories", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function updateEValuationCategory(eValuationCategory: EValuationCategory): Promise<void> {
  const formData = new FormData();
  formData.append("_method", "PUT");
  formData.append("name", eValuationCategory.name);
  formData.append("desc", eValuationCategory.desc);
  formData.append("parent", eValuationCategory.parent);

  await http.post(`e-valuation-categories/${eValuationCategory.id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function getEValuationsCategoriesById(eValuationCategoryId: string): Promise<EValuationCategory | null> {
  try {
    const response = await http.get(`e-valuation-categories/${eValuationCategoryId}`);
    return response.data.data;
  } catch (error) {
    // Handle the error appropriately, e.g., log the error or show an error message
    console.error("Error fetching EValuationCategory by ID:", error);
    return null;
  }
}

export async function deleteEValuationCategory(eValuationCategoryId: string): Promise<void> {
  await http.delete(`e-valuation-categories/${eValuationCategoryId}`);
}
