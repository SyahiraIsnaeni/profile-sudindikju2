export interface Commitment {
  id: number;
  name: string;
  description?: string | null;
  file?: string | null;
  icon?: string | null;
  sort_order?: number | null;
  status: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}

export interface CommitmentResponse {
  id: number;
  name: string;
  description?: string | null;
  file?: string | null;
  icon?: string | null;
  sort_order?: number | null;
  status: number;
  created_at: Date;
  updated_at: Date;
}
