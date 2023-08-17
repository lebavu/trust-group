import http from "@/utils/http";
import { Media } from "@/api/types";

export async function getAllMedia(): Promise<Media[]> {
  const response = await http.get("media");
  return response.data.data;
}

export async function uploadMedia(formData: FormData): Promise<void> {
  await http.post("media/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export const deleteMedia = async (id: number) => {
  await http.delete(`/media/${id}`);
};
