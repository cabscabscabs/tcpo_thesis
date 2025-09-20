export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      // Legacy table (keep for compatibility)
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
      
      // User roles and authentication
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: 'admin' | 'editor' | 'user'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: 'admin' | 'editor' | 'user'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'admin' | 'editor' | 'user'
          created_at?: string
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
      
      // Content tables
      news_articles: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string | null
          cover_image_url: string | null
          tags: string[]
          published: boolean
          published_at: string | null
          author_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          content?: string | null
          cover_image_url?: string | null
          tags?: string[]
          published?: boolean
          published_at?: string | null
          author_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string | null
          cover_image_url?: string | null
          tags?: string[]
          published?: boolean
          published_at?: string | null
          author_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_articles_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      
      services: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          order_num: number
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          order_num?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          order_num?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      
      technologies: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          website_url: string | null
          logo_url: string | null
          featured: boolean
          order_num: number
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          website_url?: string | null
          logo_url?: string | null
          featured?: boolean
          order_num?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          website_url?: string | null
          logo_url?: string | null
          featured?: boolean
          order_num?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      
      partners: {
        Row: {
          id: string
          name: string
          website_url: string | null
          logo_url: string | null
          description: string | null
          order_num: number
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          website_url?: string | null
          logo_url?: string | null
          description?: string | null
          order_num?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          website_url?: string | null
          logo_url?: string | null
          description?: string | null
          order_num?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      
      team_members: {
        Row: {
          id: string
          full_name: string
          role_title: string | null
          bio: string | null
          avatar_url: string | null
          email: string | null
          linkedin_url: string | null
          order_num: number
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          role_title?: string | null
          bio?: string | null
          avatar_url?: string | null
          email?: string | null
          linkedin_url?: string | null
          order_num?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          role_title?: string | null
          bio?: string | null
          avatar_url?: string | null
          email?: string | null
          linkedin_url?: string | null
          order_num?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      
      portfolio_items: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          image_url: string | null
          link_url: string | null
          category: string | null
          tags: string[]
          published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
          // Extended fields for patent/IP data
          inventors: string | null
          field: string | null
          status: string | null
          year: string | null
          abstract: string | null
          licensing: string | null
          applications: string[] | null
          contact: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          image_url?: string | null
          link_url?: string | null
          category?: string | null
          tags?: string[]
          published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
          // Extended fields for patent/IP data
          inventors?: string | null
          field?: string | null
          status?: string | null
          year?: string | null
          abstract?: string | null
          licensing?: string | null
          applications?: string[] | null
          contact?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          link_url?: string | null
          category?: string | null
          tags?: string[]
          published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
          // Extended fields for patent/IP data
          inventors?: string | null
          field?: string | null
          status?: string | null
          year?: string | null
          abstract?: string | null
          licensing?: string | null
          applications?: string[] | null
          contact?: string | null
        }
        Relationships: []
      }
      
      resources: {
        Row: {
          id: string
          title: string
          slug: string
          type: 'article' | 'guide' | 'video' | 'download' | 'link'
          url: string | null
          content: string | null
          file_url: string | null
          tags: string[]
          published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          type?: 'article' | 'guide' | 'video' | 'download' | 'link'
          url?: string | null
          content?: string | null
          file_url?: string | null
          tags?: string[]
          published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          type?: 'article' | 'guide' | 'video' | 'download' | 'link'
          url?: string | null
          content?: string | null
          file_url?: string | null
          tags?: string[]
          published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      
      impact_stats: {
        Row: {
          id: string
          metric_key: string
          metric_name: string
          value: number
          trend: number | null
          period_start: string | null
          period_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          metric_key: string
          metric_name: string
          value: number
          trend?: number | null
          period_start?: string | null
          period_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          metric_key?: string
          metric_name?: string
          value?: number
          trend?: number | null
          period_start?: string | null
          period_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      
      milestones: {
        Row: {
          id: string
          title: string
          description: string | null
          milestone_date: string
          icon: string | null
          order_num: number
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          milestone_date: string
          icon?: string | null
          order_num?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          milestone_date?: string
          icon?: string | null
          order_num?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      
      site_settings: {
        Row: {
          key: string
          value: Json
          updated_at: string
        }
        Insert: {
          key: string
          value: Json
          updated_at?: string
        }
        Update: {
          key?: string
          value?: Json
          updated_at?: string
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
      app_role: 'admin' | 'editor' | 'user'
      resource_type: 'article' | 'guide' | 'video' | 'download' | 'link'
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
      app_role: ['admin', 'editor', 'user'] as const,
      resource_type: ['article', 'guide', 'video', 'download', 'link'] as const,
    },
  },
} as const