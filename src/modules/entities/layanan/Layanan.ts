export interface Layanan {
  id: number;
  nama: string;
  deskripsi?: string | null;
  file?: string | null;
  icon?: string | null;
  urutan?: number | null;
  status: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}

export interface LayananResponse {
  id: number;
  nama: string;
  deskripsi?: string | null;
  file?: string | null;
  icon?: string | null;
  urutan?: number | null;
  status: number;
  created_at: Date;
  updated_at: Date;
}
