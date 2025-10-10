export interface User {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  is_active: boolean;
  is_verified: boolean;
  tenant_id: number;
  company?: string;
}
