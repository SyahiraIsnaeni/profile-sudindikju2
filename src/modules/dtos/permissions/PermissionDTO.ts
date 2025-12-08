export interface PermissionDTO {
  id: number;
  name: string;
  detail: string;
}

export interface GroupedPermissionsDTO {
  [key: string]: PermissionDTO[];
}