import http from "@/utils/http";
import { PawnTickets } from "./types";

export async function fetchPawnTickets(): Promise<PawnTickets[]> {
  const response = await http.get("pawn-tickets");
  return response.data.data;
}

export async function createPawnTicket(pawnTicket: PawnTickets): Promise<void> {
  const formData = new FormData();
  formData.append("user_id", pawnTicket.user_id);
  formData.append("date_time", pawnTicket.date_time.toISOString());
  formData.append("details", pawnTicket.details);

  await http.post("pawn-tickets", formData, {
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

  await http.post(`pawn-tickets/${pawnTicket.id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function deletePawnTicket(pawnTicketId: string): Promise<void> {
  await http.delete(`pawn-tickets/${pawnTicketId}`);
}
