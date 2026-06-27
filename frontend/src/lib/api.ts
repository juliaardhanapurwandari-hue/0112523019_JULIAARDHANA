export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export type Mahasiswa = {
  id: number;
  nim: string;
  nama: string;
  prodi_id: number;
  nama_prodi: string;
  angkatan: number;
  foto?: string | null;
  created_at?: string;
};

export type Prodi = {
  id: number;
  nama_prodi: string;
};

type ApiResponse<T> = {
  message: string;
  meta?: any;
  data?: T;
};

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Terjadi kesalahan saat mengakses API");
  }
  return result;
}

export async function getProdi(): Promise<Prodi[]> {
  const response = await fetch(`${API_URL}/prodi`, {
    cache: "no-store",
  });
  const result = await handleResponse<Prodi[]>(response);
  return result.data || [];
}

export async function getMahasiswa(params?: {
  search?: string;
  prodi_id?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<Mahasiswa[]>> {
  const query = new URLSearchParams();

  if (params?.search) query.set("search", params.search);
  if (params?.prodi_id) query.set("prodi_id", params.prodi_id);
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));

  const response = await fetch(`${API_URL}/mahasiswa?${query.toString()}`, {
    cache: "no-store",
  });

  const result = await handleResponse<Mahasiswa[]>(response);
  return result; // return full result because we need meta (totalPage)
}

export async function createMahasiswa(formData: FormData): Promise<Mahasiswa> {
  const response = await fetch(`${API_URL}/mahasiswa`, {
    method: "POST",
    body: formData,
  });

  const result = await handleResponse<Mahasiswa>(response);
  return result.data as Mahasiswa;
}

export async function updateMahasiswa(id: number, formData: FormData): Promise<void> {
  const response = await fetch(`${API_URL}/mahasiswa/${id}`, {
    method: "PUT",
    body: formData,
  });

  await handleResponse(response);
}

export async function deleteMahasiswa(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/mahasiswa/${id}`, {
    method: "DELETE",
  });

  await handleResponse(response);
}
