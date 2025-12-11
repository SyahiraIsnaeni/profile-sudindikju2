export interface CreateLayananDTO {
  nama: string;
  deskripsi?: string | null;
  file?: string | null;
  icon?: string | null;
  urutan?: number | null;
  status: number;
}
