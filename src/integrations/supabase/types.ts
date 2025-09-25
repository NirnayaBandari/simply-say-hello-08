export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          active: boolean | null
          created_at: string
          description: string
          icon: string | null
          id: string
          name: string
          points_reward: number | null
          requirement_type: string
          requirement_value: Json | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description: string
          icon?: string | null
          id?: string
          name: string
          points_reward?: number | null
          requirement_type: string
          requirement_value?: Json | null
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string
          icon?: string | null
          id?: string
          name?: string
          points_reward?: number | null
          requirement_type?: string
          requirement_value?: Json | null
        }
        Relationships: []
      }
      canteen_status: {
        Row: {
          available_seats: number | null
          estimated_wait_minutes: number | null
          id: string
          queue_length: number | null
          rush_hour: boolean | null
          total_seats: number | null
          updated_at: string
        }
        Insert: {
          available_seats?: number | null
          estimated_wait_minutes?: number | null
          id?: string
          queue_length?: number | null
          rush_hour?: boolean | null
          total_seats?: number | null
          updated_at?: string
        }
        Update: {
          available_seats?: number | null
          estimated_wait_minutes?: number | null
          id?: string
          queue_length?: number | null
          rush_hour?: boolean | null
          total_seats?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          food_item_id: string
          id: string
          quantity: number
          special_instructions: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          food_item_id: string
          id?: string
          quantity?: number
          special_instructions?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          food_item_id?: string
          id?: string
          quantity?: number
          special_instructions?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
        ]
      }
      food_categories: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          name: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          name: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          name?: string
        }
        Relationships: []
      }
      food_items: {
        Row: {
          allergens: Database["public"]["Enums"]["allergen_type"][] | null
          availability_status: boolean | null
          calories: number | null
          carbs_g: number | null
          category_id: string | null
          created_at: string
          description: string | null
          fat_g: number | null
          health_tags: Database["public"]["Enums"]["health_tag"][] | null
          id: string
          image_url: string | null
          name: string
          prep_time_minutes: number | null
          price: number
          protein_g: number | null
          rating: number | null
          rating_count: number | null
          updated_at: string
        }
        Insert: {
          allergens?: Database["public"]["Enums"]["allergen_type"][] | null
          availability_status?: boolean | null
          calories?: number | null
          carbs_g?: number | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          fat_g?: number | null
          health_tags?: Database["public"]["Enums"]["health_tag"][] | null
          id?: string
          image_url?: string | null
          name: string
          prep_time_minutes?: number | null
          price: number
          protein_g?: number | null
          rating?: number | null
          rating_count?: number | null
          updated_at?: string
        }
        Update: {
          allergens?: Database["public"]["Enums"]["allergen_type"][] | null
          availability_status?: boolean | null
          calories?: number | null
          carbs_g?: number | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          fat_g?: number | null
          health_tags?: Database["public"]["Enums"]["health_tag"][] | null
          id?: string
          image_url?: string | null
          name?: string
          prep_time_minutes?: number | null
          price?: number
          protein_g?: number | null
          rating?: number | null
          rating_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "food_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      food_ratings: {
        Row: {
          created_at: string
          food_item_id: string
          id: string
          rating: number
          review: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          food_item_id: string
          id?: string
          rating: number
          review?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          food_item_id?: string
          id?: string
          rating?: number
          review?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_ratings_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
        ]
      }
      group_order_participants: {
        Row: {
          group_order_id: string
          id: string
          joined_at: string
          order_id: string | null
          user_id: string
        }
        Insert: {
          group_order_id: string
          id?: string
          joined_at?: string
          order_id?: string | null
          user_id: string
        }
        Update: {
          group_order_id?: string
          id?: string
          joined_at?: string
          order_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_order_participants_group_order_id_fkey"
            columns: ["group_order_id"]
            isOneToOne: false
            referencedRelation: "group_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_order_participants_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      group_orders: {
        Row: {
          created_at: string
          creator_id: string
          description: string | null
          id: string
          max_participants: number | null
          name: string
          status: Database["public"]["Enums"]["order_status"] | null
          target_pickup_time: string | null
          total_amount: number | null
        }
        Insert: {
          created_at?: string
          creator_id: string
          description?: string | null
          id?: string
          max_participants?: number | null
          name: string
          status?: Database["public"]["Enums"]["order_status"] | null
          target_pickup_time?: string | null
          total_amount?: number | null
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string | null
          id?: string
          max_participants?: number | null
          name?: string
          status?: Database["public"]["Enums"]["order_status"] | null
          target_pickup_time?: string | null
          total_amount?: number | null
        }
        Relationships: []
      }
      loyalty_points: {
        Row: {
          created_at: string
          id: string
          level_name: string | null
          points: number | null
          total_earned: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          level_name?: string | null
          points?: number | null
          total_earned?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          level_name?: string | null
          points?: number | null
          total_earned?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          food_item_id: string
          id: string
          order_id: string
          quantity: number
          special_instructions: string | null
          subtotal: number
          unit_price: number
        }
        Insert: {
          food_item_id: string
          id?: string
          order_id: string
          quantity: number
          special_instructions?: string | null
          subtotal: number
          unit_price: number
        }
        Update: {
          food_item_id?: string
          id?: string
          order_id?: string
          quantity?: number
          special_instructions?: string | null
          subtotal?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          group_order_id: string | null
          id: string
          is_group_order: boolean | null
          order_number: string
          pickup_time: string | null
          special_instructions: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          group_order_id?: string | null
          id?: string
          is_group_order?: boolean | null
          order_number: string
          pickup_time?: string | null
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          group_order_id?: string | null
          id?: string
          is_group_order?: boolean | null
          order_number?: string
          pickup_time?: string | null
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          method: Database["public"]["Enums"]["payment_method"]
          order_id: string
          status: Database["public"]["Enums"]["payment_status"] | null
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          method: Database["public"]["Enums"]["payment_method"]
          order_id: string
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          order_id?: string
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      polls: {
        Row: {
          active: boolean | null
          created_at: string
          created_by: string | null
          description: string | null
          expires_at: string | null
          id: string
          options: Json
          title: string
          votes: Json | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          options: Json
          title: string
          votes?: Json | null
        }
        Update: {
          active?: boolean | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          options?: Json
          title?: string
          votes?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          budget_limit: number | null
          college_id: string | null
          created_at: string
          dietary_preferences: string[] | null
          email: string
          full_name: string | null
          health_goals: string[] | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          budget_limit?: number | null
          college_id?: string | null
          created_at?: string
          dietary_preferences?: string[] | null
          email: string
          full_name?: string | null
          health_goals?: string[] | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          budget_limit?: number | null
          college_id?: string | null
          created_at?: string
          dietary_preferences?: string[] | null
          email?: string
          full_name?: string | null
          health_goals?: string[] | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_wallets: {
        Row: {
          balance: number | null
          created_at: string
          id: string
          total_spent_month: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number | null
          created_at?: string
          id?: string
          total_spent_month?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number | null
          created_at?: string
          id?: string
          total_spent_month?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      allergen_type:
        | "peanuts"
        | "gluten"
        | "dairy"
        | "soy"
        | "eggs"
        | "shellfish"
        | "tree_nuts"
        | "fish"
      health_tag:
        | "vegan"
        | "vegetarian"
        | "high_protein"
        | "high_energy"
        | "brain_food"
        | "low_calorie"
        | "budget_friendly"
      order_status:
        | "pending"
        | "confirmed"
        | "preparing"
        | "ready"
        | "completed"
        | "cancelled"
      payment_method: "card" | "upi" | "cash" | "wallet"
      payment_status: "pending" | "completed" | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      allergen_type: [
        "peanuts",
        "gluten",
        "dairy",
        "soy",
        "eggs",
        "shellfish",
        "tree_nuts",
        "fish",
      ],
      health_tag: [
        "vegan",
        "vegetarian",
        "high_protein",
        "high_energy",
        "brain_food",
        "low_calorie",
        "budget_friendly",
      ],
      order_status: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "completed",
        "cancelled",
      ],
      payment_method: ["card", "upi", "cash", "wallet"],
      payment_status: ["pending", "completed", "failed"],
    },
  },
} as const
