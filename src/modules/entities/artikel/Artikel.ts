export interface Artikel {
  id: number;
  judul: string;
  deskripsi?: string | null;
  kategori?: string | null;
  gambar?: string | null;
  file?: string | null;
  penulis?: string | null;
  tanggal: Date;
  status: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}

export interface ArtikelResponse {
  id: number;
  judul: string;
  deskripsi?: string | null;
  kategori?: string | null;
  gambar?: string | null;
  file?: string | null;
  penulis?: string | null;
  tanggal: Date;
  status: number;
  created_at: Date;
  updated_at: Date;
}
