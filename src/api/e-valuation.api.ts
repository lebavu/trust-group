import http from "@/utils/http";
import { EValuation } from "./types";

export async function fetchEValuations(): Promise<EValuation[]> {
  const response = await http.get("roles");
  return response.data.data;
}

export async function createEValuation(eValuation: EValuation): Promise<void> {
  await http.post("eValuations", eValuation );
}

export async function updateEValuation(eValuation: EValuation): Promise<void> {
  await http.put(`eValuations/${eValuation.id}`, eValuation);
}

export async function deleteEValuation(eValuationId: string): Promise<void> {
  await http.delete(`eValuations/${eValuationId}`);
}
