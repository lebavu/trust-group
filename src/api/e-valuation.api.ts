import http from "@/utils/http";
import { type AxiosResponse } from "axios";
import { EValuation, EValuationsResponse } from "./types";

export async function fetchEValuations(page: number): Promise<EValuationsResponse> {
  const response: AxiosResponse<EValuationsResponse> = await http.get(`e-valuations?page=${page}`);
  const data = response.data.data;
  const meta = response.data.meta;

  return { data, meta };
}


export async function createEValuation(eValuation: EValuation): Promise<void> {
  await http.post("e-valuations", eValuation );
}

export async function updateEValuation(eValuation: EValuation): Promise<void> {
  await http.put(`e-valuations/${eValuation.id}`, eValuation);
}

export async function deleteEValuation(eValuationId: string): Promise<void> {
  await http.delete(`e-valuations/${eValuationId}`);
}
