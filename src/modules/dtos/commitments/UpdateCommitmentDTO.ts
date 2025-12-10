export interface UpdateCommitmentDTO {
  name?: string;
  description?: string | null;
  file?: string | null;
  icon?: string | null;
  sort_order?: number | null;
  status?: number;
}
