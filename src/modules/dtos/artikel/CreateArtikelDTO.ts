export interface CreateArtikelDTO {
  judul: string;
  deskripsi?: string | null;
  kategori?: string | null;
  gambar?: string | null;
  file?: string | null;
  penulis?: string | null;
  tanggal: Date;
  status: number;
}
