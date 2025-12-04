export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  user: {
    id: number;
    name: string;
    email: string;
    role_id?: number | null;
  };
  token?: string;
  message: string;
}