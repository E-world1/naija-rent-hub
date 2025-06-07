
export interface Agent {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  user_type: string;
  created_at: string;
  updated_at: string;
  propertyCount: number;
}
