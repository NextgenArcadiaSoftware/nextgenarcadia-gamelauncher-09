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
      bookings: {
        Row: {
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          date: string
          event_title: string
          id: string
          number_of_females: number | null
          number_of_guests: number | null
          number_of_males: number | null
          price: number | null
          reference: string
          special_requests: string | null
          status: Database["public"]["Enums"]["booking_status"] | null
          table_type: string | null
          type: Database["public"]["Enums"]["booking_type"]
        }
        Insert: {
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone: string
          date: string
          event_title: string
          id?: string
          number_of_females?: number | null
          number_of_guests?: number | null
          number_of_males?: number | null
          price?: number | null
          reference: string
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          table_type?: string | null
          type: Database["public"]["Enums"]["booking_type"]
        }
        Update: {
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          date?: string
          event_title?: string
          id?: string
          number_of_females?: number | null
          number_of_guests?: number | null
          number_of_males?: number | null
          price?: number | null
          reference?: string
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          table_type?: string | null
          type?: Database["public"]["Enums"]["booking_type"]
        }
        Relationships: []
      }
      broadcast_recipients: {
        Row: {
          broadcast_id: string
          created_at: string
          delivered_at: string | null
          id: string
          name: string | null
          opened_at: string | null
          phone: string
          status: Database["public"]["Enums"]["delivery_status"]
        }
        Insert: {
          broadcast_id: string
          created_at?: string
          delivered_at?: string | null
          id?: string
          name?: string | null
          opened_at?: string | null
          phone: string
          status?: Database["public"]["Enums"]["delivery_status"]
        }
        Update: {
          broadcast_id?: string
          created_at?: string
          delivered_at?: string | null
          id?: string
          name?: string | null
          opened_at?: string | null
          phone?: string
          status?: Database["public"]["Enums"]["delivery_status"]
        }
        Relationships: [
          {
            foreignKeyName: "broadcast_recipients_broadcast_id_fkey"
            columns: ["broadcast_id"]
            isOneToOne: false
            referencedRelation: "broadcasts"
            referencedColumns: ["id"]
          },
        ]
      }
      broadcasts: {
        Row: {
          created_at: string
          id: string
          message: string
          name: string
          scheduled_for: string | null
          status: Database["public"]["Enums"]["broadcast_status"]
          template_id: string | null
          total_cost: number
          total_recipients: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          name: string
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["broadcast_status"]
          template_id?: string | null
          total_cost?: number
          total_recipients?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          name?: string
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["broadcast_status"]
          template_id?: string | null
          total_cost?: number
          total_recipients?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "broadcasts_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "message_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_bookings: {
        Row: {
          booking_id: string
          campaign_id: string
        }
        Insert: {
          booking_id: string
          campaign_id: string
        }
        Update: {
          booking_id?: string
          campaign_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_bookings_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_bookings_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          created_at: string | null
          description: string | null
          discount_percentage: number | null
          end_date: string | null
          id: string
          name: string
          start_date: string
          type: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          end_date?: string | null
          id?: string
          name: string
          start_date: string
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          end_date?: string | null
          id?: string
          name?: string
          start_date?: string
          type?: string
        }
        Relationships: []
      }
      check_ins: {
        Row: {
          booking_id: string | null
          check_in_time: string | null
          id: string
          reason: string | null
          status: string | null
        }
        Insert: {
          booking_id?: string | null
          check_in_time?: string | null
          id?: string
          reason?: string | null
          status?: string | null
        }
        Update: {
          booking_id?: string | null
          check_in_time?: string | null
          id?: string
          reason?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "check_ins_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      component_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_enabled: boolean | null
          name: string
          settings: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_enabled?: boolean | null
          name: string
          settings?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_enabled?: boolean | null
          name?: string
          settings?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_list_members: {
        Row: {
          contact_id: string
          created_at: string
          list_id: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          list_id: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          list_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_list_members_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_list_members_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "contact_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_lists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          total_contacts: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          total_contacts?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          total_contacts?: number
          updated_at?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          created_at: string
          email: string | null
          id: string
          last_broadcast_received_at: string | null
          name: string | null
          phone: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          last_broadcast_received_at?: string | null
          name?: string | null
          phone: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          last_broadcast_received_at?: string | null
          name?: string | null
          phone?: string
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          button_link: string | null
          button_text: string | null
          capacity: number | null
          created_at: string
          date: string
          description: string | null
          id: string
          image: string | null
          is_enabled: boolean | null
          location: string
          price: number
          time: string
          title: string
          updated_at: string
        }
        Insert: {
          button_link?: string | null
          button_text?: string | null
          capacity?: number | null
          created_at?: string
          date: string
          description?: string | null
          id?: string
          image?: string | null
          is_enabled?: boolean | null
          location: string
          price: number
          time: string
          title: string
          updated_at?: string
        }
        Update: {
          button_link?: string | null
          button_text?: string | null
          capacity?: number | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          image?: string | null
          is_enabled?: boolean | null
          location?: string
          price?: number
          time?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      guest_profiles: {
        Row: {
          created_at: string
          id: string
          last_visit: string
          name: string
          phone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_visit?: string
          name: string
          phone: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_visit?: string
          name?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      influencers: {
        Row: {
          created_at: string
          description: string | null
          followers_count: number
          id: string
          image_url: string
          name: string
          social_handle: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          followers_count: number
          id?: string
          image_url: string
          name: string
          social_handle: string
        }
        Update: {
          created_at?: string
          description?: string | null
          followers_count?: number
          id?: string
          image_url?: string
          name?: string
          social_handle?: string
        }
        Relationships: []
      }
      message_templates: {
        Row: {
          content: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      messaging_credits: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          transaction_type: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          transaction_type: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          transaction_type?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          button_link: string | null
          button_text: string | null
          created_at: string
          description: string
          id: string
          image: string
          is_enabled: boolean | null
          sort_order: number
          title: string
          updated_at: string
          valid_from: string | null
          valid_until: string
        }
        Insert: {
          button_link?: string | null
          button_text?: string | null
          created_at?: string
          description: string
          id?: string
          image: string
          is_enabled?: boolean | null
          sort_order?: number
          title: string
          updated_at?: string
          valid_from?: string | null
          valid_until: string
        }
        Update: {
          button_link?: string | null
          button_text?: string | null
          created_at?: string
          description?: string
          id?: string
          image?: string
          is_enabled?: boolean | null
          sort_order?: number
          title?: string
          updated_at?: string
          valid_from?: string | null
          valid_until?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          provider: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          provider?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          provider?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
    }
    Views: {
      booking_stats: {
        Row: {
          avg_group_size: number | null
          booking_date: string | null
          cancelled_bookings: number | null
          confirmed_bookings: number | null
          total_bookings: number | null
          total_revenue: number | null
          unique_customers: number | null
        }
        Relationships: []
      }
      customer_insights: {
        Row: {
          customer_email: string | null
          first_booking: string | null
          last_booking: string | null
          total_bookings: number | null
          total_spent: number | null
          unique_booking_days: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      booking_status: "pending" | "confirmed" | "cancelled"
      booking_type: "guest_list" | "vip_table"
      broadcast_status:
        | "draft"
        | "scheduled"
        | "sending"
        | "completed"
        | "failed"
      delivery_status: "pending" | "sent" | "delivered" | "failed" | "opened"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
