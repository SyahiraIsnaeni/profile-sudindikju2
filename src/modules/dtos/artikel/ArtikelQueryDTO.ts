export interface ArtikelQueryDTO {
  page: number;
  pageSize: number;
  search?: string;
  status?: number;
  kategori?: string;
}
