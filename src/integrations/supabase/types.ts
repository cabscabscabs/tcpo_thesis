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
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          department: string | null
          employee_id: string | null
          phone: string | null
          role: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          department?: string | null
          employee_id?: string | null
          phone?: string | null
          role?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          department?: string | null
          employee_id?: string | null
          phone?: string | null
          role?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      activity_logs: {
        Row: {
          id: string
          activity_type: string
          action: string
          title: string
          description: string | null
          user_id: string | null
          metadata: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          activity_type: string
          action: string
          title: string
          description?: string | null
          user_id?: string | null
          metadata?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          activity_type?: string
          action?: string
          title?: string
          description?: string | null
          user_id?: string | null
          metadata?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      // Admin tables for localStorage migration
      admin_homepage_content: {
        Row: {
          id: string
          hero_title: string
          hero_subtitle: string
          hero_image_url: string | null
          patents_count: number
          partners_count: number
          startups_count: number
          technologies_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          hero_title?: string
          hero_subtitle?: string
          hero_image_url?: string | null
          patents_count?: number
          partners_count?: number
          startups_count?: number
          technologies_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          hero_title?: string
          hero_subtitle?: string
          hero_image_url?: string | null
          patents_count?: number
          partners_count?: number
          startups_count?: number
          technologies_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_technologies: {
        Row: {
          id: string
          title: string
          description: string | null
          field: string | null
          status: string
          inventors: string | null
          year: string | null
          abstract: string | null
          image_url: string | null
          featured: boolean
          order_num: number
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          field?: string | null
          status?: string
          inventors?: string | null
          year?: string | null
          abstract?: string | null
          image_url?: string | null
          featured?: boolean
          order_num?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          field?: string | null
          status?: string
          inventors?: string | null
          year?: string | null
          abstract?: string | null
          image_url?: string | null
          featured?: boolean
          order_num?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_news: {
        Row: {
          id: string
          title: string
          excerpt: string | null
          content: string | null
          category: string | null
          author: string | null
          status: string
          date: string | null
          cover_image_url: string | null
          tags: string[]
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          excerpt?: string | null
          content?: string | null
          category?: string | null
          author?: string | null
          status?: string
          date?: string | null
          cover_image_url?: string | null
          tags?: string[]
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          excerpt?: string | null
          content?: string | null
          category?: string | null
          author?: string | null
          status?: string
          date?: string | null
          cover_image_url?: string | null
          tags?: string[]
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_patents: {
        Row: {
          id: string
          title: string
          patent_number: string | null
          inventors: string | null
          field: string | null
          abstract: string | null
          status: string
          year: string | null
          licensing_info: string | null
          applications: string[]
          contact: string | null
          technology_fields: string[]
          image_url: string | null
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          patent_number?: string | null
          inventors?: string | null
          field?: string | null
          abstract?: string | null
          status?: string
          year?: string | null
          licensing_info?: string | null
          applications?: string[]
          contact?: string | null
          technology_fields?: string[]
          image_url?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          patent_number?: string | null
          inventors?: string | null
          field?: string | null
          abstract?: string | null
          status?: string
          year?: string | null
          licensing_info?: string | null
          applications?: string[]
          contact?: string | null
          technology_fields?: string[]
          image_url?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_events: {
        Row: {
          id: string
          title: string
          type: string
          date: string | null
          time: string | null
          location: string | null
          capacity: number | null
          description: string | null
          image_url: string | null
          registration_open: boolean
          attendees_count: number
          status: string
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          type?: string
          date?: string | null
          time?: string | null
          location?: string | null
          capacity?: number | null
          description?: string | null
          image_url?: string | null
          registration_open?: boolean
          attendees_count?: number
          status?: string
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          type?: string
          date?: string | null
          time?: string | null
          location?: string | null
          capacity?: number | null
          description?: string | null
          image_url?: string | null
          registration_open?: boolean
          attendees_count?: number
          status?: string
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          id: string
          event_id: string
          full_name: string
          email: string
          phone: string | null
          organization: string | null
          position: string | null
          dietary_requirements: string | null
          special_requests: string | null
          status: string
          registered_at: string
          confirmed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          full_name: string
          email: string
          phone?: string | null
          organization?: string | null
          position?: string | null
          dietary_requirements?: string | null
          special_requests?: string | null
          status?: string
          registered_at?: string
          confirmed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          full_name?: string
          email?: string
          phone?: string | null
          organization?: string | null
          position?: string | null
          dietary_requirements?: string | null
          special_requests?: string | null
          status?: string
          registered_at?: string
          confirmed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "admin_events"
            referencedColumns: ["id"]
          }
        ]
      }
      admin_service_requests: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          organization: string | null
          service_type: string | null
          service_title: string | null
          preferred_date: string | null
          participants: string | null
          specific_needs: string | null
          budget: string | null
          timeline: string | null
          status: string
          submitted_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          organization?: string | null
          service_type?: string | null
          service_title?: string | null
          preferred_date?: string | null
          participants?: string | null
          specific_needs?: string | null
          budget?: string | null
          timeline?: string | null
          status?: string
          submitted_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          organization?: string | null
          service_type?: string | null
          service_title?: string | null
          preferred_date?: string | null
          participants?: string | null
          specific_needs?: string | null
          budget?: string | null
          timeline?: string | null
          status?: string
          submitted_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_dashboard_stats: {
        Row: {
          id: string
          total_patents: number
          patents_this_month: number
          published_news: number
          news_this_week: number
          upcoming_events: number
          next_event_date: string | null
          service_requests_count: number
          pending_requests: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          total_patents?: number
          patents_this_month?: number
          published_news?: number
          news_this_week?: number
          upcoming_events?: number
          next_event_date?: string | null
          service_requests_count?: number
          pending_requests?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          total_patents?: number
          patents_this_month?: number
          published_news?: number
          news_this_week?: number
          upcoming_events?: number
          next_event_date?: string | null
          service_requests_count?: number
          pending_requests?: number
          created_at?: string
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
