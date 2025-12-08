export interface Role {
  id: number;
  name: string;
  status: number;
  created_at: Date;
  updated_at: Date;
}

export interface RoleResponse {
  id: number;
  name: string;
  status: number;
  permissions?: {
    id: number;
    name: string;
    detail: string;
  }[];
  created_at: Date;
  updated_at: Date;
}

export interface Permission {
  id: number;
  name: string;
  detail: string;
}
