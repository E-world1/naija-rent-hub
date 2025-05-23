export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      investment_properties: {
        Row: {
          appreciation_model: string
          appreciation_rate: number | null
          created_at: string
          current_value: number
          id: number
          initial_value: number
          last_update_date: string
          property_id: number | null
        }
        Insert: {
          appreciation_model?: string
          appreciation_rate?: number | null
          created_at?: string
          current_value: number
          id?: number
          initial_value: number
          last_update_date?: string
          property_id?: number | null
        }
        Update: {
          appreciation_model?: string
          appreciation_rate?: number | null
          created_at?: string
          current_value?: number
          id?: number
          initial_value?: number
          last_update_date?: string
          property_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "investment_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: true
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
          user_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string | null
          agent_id: string
          area: string | null
          bathrooms: number | null
          bedrooms: number | null
          created_at: string
          description: string | null
          features: string[] | null
          id: number
          image: string | null
          images: string[] | null
          lga: string
          period: string
          price: string
          square_feet: string | null
          state: string
          status: string | null
          title: string
          type: string | null
          updated_at: string
          views: number | null
        }
        Insert: {
          address?: string | null
          agent_id: string
          area?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: number
          image?: string | null
          images?: string[] | null
          lga: string
          period?: string
          price: string
          square_feet?: string | null
          state: string
          status?: string | null
          title: string
          type?: string | null
          updated_at?: string
          views?: number | null
        }
        Update: {
          address?: string | null
          agent_id?: string
          area?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: number
          image?: string | null
          images?: string[] | null
          lga?: string
          period?: string
          price?: string
          square_feet?: string | null
          state?: string
          status?: string | null
          title?: string
          type?: string | null
          updated_at?: string
          views?: number | null
        }
        Relationships: []
      }
      property_value_history: {
        Row: {
          id: number
          investment_property_id: number | null
          property_value: number
          value_date: string
        }
        Insert: {
          id?: number
          investment_property_id?: number | null
          property_value: number
          value_date?: string
        }
        Update: {
          id?: number
          investment_property_id?: number | null
          property_value?: number
          value_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_value_history_investment_property_id_fkey"
            columns: ["investment_property_id"]
            isOneToOne: false
            referencedRelation: "investment_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      user_investments: {
        Row: {
          id: number
          investment_amount: number
          investment_date: string
          investment_property_id: number | null
          shares: number
          user_id: string | null
        }
        Insert: {
          id?: number
          investment_amount: number
          investment_date?: string
          investment_property_id?: number | null
          shares: number
          user_id?: string | null
        }
        Update: {
          id?: number
          investment_amount?: number
          investment_date?: string
          investment_property_id?: number | null
          shares?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_investments_investment_property_id_fkey"
            columns: ["investment_property_id"]
            isOneToOne: false
            referencedRelation: "investment_properties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
