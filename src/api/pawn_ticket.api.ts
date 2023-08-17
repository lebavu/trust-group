import http from "@/utils/http";
import { PawnTickets } from "./types";

export async function fetchPawnTickets(): Promise<PawnTickets[]> {
  const response = await http.get("pawn-tickets");
  return response.data.data;
}

export async function createPawnTicket(pawnTicket: PawnTickets): Promise<void> {
  await http.post("pawn-tickets", pawnTicket );
}

export async function updatePawnTicket(pawnTicket: PawnTickets): Promise<void> {
  await http.put(`pawn-tickets/${pawnTicket.id}`, pawnTicket);
}

export async function deletePawnTicket(pawnTicketId: string): Promise<void> {
  await http.delete(`pawn-tickets/${pawnTicketId}`);
}
