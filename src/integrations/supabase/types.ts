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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      impact_stats: {
        Row: {
          created_at: string | null
          id: string
          metric_key: string
          metric_name: string
          period_end: string | null
          period_start: string | null
          trend: number | null
          updated_at: string | null
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          metric_key: string
          metric_name: string
          period_end?: string | null
          period_start?: string | null
          trend?: number | null
          updated_at?: string | null
          value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          metric_key?: string
          metric_name?: string
          period_end?: string | null
          period_start?: string | null
          trend?: number | null
          updated_at?: string | null
          value?: number
        }
        Relationships: []
      }
      milestones: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          milestone_date: string
          order_num: number | null
          published: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          milestone_date: string
          order_num?: number | null
          published?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          milestone_date?: string
          order_num?: number | null
          published?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      news_articles: {
        Row: {
          author_id: string | null
          content: string | null
          cover_image_url: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          published: boolean | null
          published_at: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      partners: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          logo_url: string | null
          name: string
          order_num: number | null
          published: boolean | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          order_num?: number | null
          published?: boolean | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          order_num?: number | null
          published?: boolean | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      portfolio_items: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          link_url: string | null
          published: boolean | null
          published_at: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
          // Extended fields for patent/IP data
          inventors: string | null
          field: string | null
          status: string | null
          year: string | null
          abstract: string | null
          licensing: string | null
          applications: string[] | null
          contact: string | null
          patent_number: string | null
          patent_status: string | null
          grant_date: string | null
          technology_fields: string[] | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          link_url?: string | null
          published?: boolean | null
          published_at?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          // Extended fields for patent/IP data
          inventors?: string | null
          field?: string | null
          status?: string | null
          year?: string | null
          abstract?: string | null
          licensing?: string | null
          applications?: string[] | null
          contact?: string | null
          patent_number?: string | null
          patent_status?: string | null
          grant_date?: string | null
          technology_fields?: string[] | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          link_url?: string | null
          published?: boolean | null
          published_at?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          // Extended fields for patent/IP data
          inventors?: string | null
          field?: string | null
          status?: string | null
          year?: string | null
          abstract?: string | null
          licensing?: string | null
          applications?: string[] | null
          contact?: string | null
          patent_number?: string | null
          patent_status?: string | null
          grant_date?: string | null
          technology_fields?: string[] | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          content: string | null
          created_at: string | null
          file_url: string | null
          id: string
          published: boolean | null
          published_at: string | null
          slug: string
          tags: string[] | null
          title: string
          type: Database["public"]["Enums"]["resource_type"] | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          file_url?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug: string
          tags?: string[] | null
          title: string
          type?: Database["public"]["Enums"]["resource_type"] | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          file_url?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          type?: Database["public"]["Enums"]["resource_type"] | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          order_num: number | null
          published: boolean | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          order_num?: number | null
          published?: boolean | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          order_num?: number | null
          published?: boolean | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      team_members: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          linkedin_url: string | null
          order_num: number | null
          published: boolean | null
          role_title: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          linkedin_url?: string | null
          order_num?: number | null
          published?: boolean | null
          role_title?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          linkedin_url?: string | null
          order_num?: number | null
          published?: boolean | null
          role_title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      technologies: {
        Row: {
          created_at: string | null
          description: string | null
          featured: boolean | null
          id: string
          logo_url: string | null
          name: string
          order_num: number | null
          published: boolean | null
          slug: string
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          logo_url?: string | null
          name: string
          order_num?: number | null
          published?: boolean | null
          slug: string
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          logo_url?: string | null
          name?: string
          order_num?: number | null
          published?: boolean | null
          slug?: string
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      tpco_main: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
      app_role: "admin" | "editor" | "user"
      resource_type: "article" | "guide" | "video" | "download" | "link"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

// Simplified type definitions to avoid complex generic errors
export type Tables<TableName extends keyof DefaultSchema["Tables"]> = DefaultSchema["Tables"][TableName]["Row"]

export type TablesInsert<TableName extends keyof DefaultSchema["Tables"]> = DefaultSchema["Tables"][TableName]["Insert"]

export type TablesUpdate<TableName extends keyof DefaultSchema["Tables"]> = DefaultSchema["Tables"][TableName]["Update"]

export type Enums<EnumName extends keyof DefaultSchema["Enums"]> = DefaultSchema["Enums"][EnumName]

export type CompositeTypes<CompositeTypeName extends keyof DefaultSchema["CompositeTypes"]> = DefaultSchema["CompositeTypes"][CompositeTypeName]

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "user"],
      resource_type: ["article", "guide", "video", "download", "link"],
    },
  },
} as const