export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role_id?: number | null;
  status: number;
}
