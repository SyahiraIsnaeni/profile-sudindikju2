export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  token_oauth?: string | null;
  role_id?: number | null;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role_id?: number | null;
}