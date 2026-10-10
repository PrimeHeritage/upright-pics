/**
 * Supabase database types, generated from the live schema
 * (supabase/migrations). Regenerate after schema changes via the Supabase
 * MCP `generate_typescript_types` or `supabase gen types typescript`.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Array<Json>

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.18'
  }
  public: {
    Tables: {
      admins: {
        Row: { created_at: string; user_id: string }
        Insert: { created_at?: string; user_id: string }
        Update: { created_at?: string; user_id?: string }
        Relationships: []
      }
      albums: {
        Row: {
          category_id: string | null
          cover: Json | null
          created_at: string
          featured: boolean
          id: string
          location: string | null
          published: boolean
          shot_on: string | null
          slug: string
          sort_order: number
          story: string | null
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          cover?: Json | null
          created_at?: string
          featured?: boolean
          id?: string
          location?: string | null
          published?: boolean
          shot_on?: string | null
          slug: string
          sort_order?: number
          story?: string | null
          summary?: string
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          cover?: Json | null
          created_at?: string
          featured?: boolean
          id?: string
          location?: string | null
          published?: boolean
          shot_on?: string | null
          slug?: string
          sort_order?: number
          story?: string | null
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'albums_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          client_hash: string | null
          created_at: string
          email: string | null
          event_date: string | null
          id: string
          location: string | null
          message: string
          name: string
          phone: string
          service: string | null
          status: string
        }
        Insert: {
          client_hash?: string | null
          created_at?: string
          email?: string | null
          event_date?: string | null
          id?: string
          location?: string | null
          message: string
          name: string
          phone: string
          service?: string | null
          status?: string
        }
        Update: {
          client_hash?: string | null
          created_at?: string
          email?: string | null
          event_date?: string | null
          id?: string
          location?: string | null
          message?: string
          name?: string
          phone?: string
          service?: string | null
          status?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          album_id: string
          caption: string | null
          created_at: string
          id: string
          image: Json | null
          kind: string
          poster: Json | null
          sort_order: number
          video_url: string | null
        }
        Insert: {
          album_id: string
          caption?: string | null
          created_at?: string
          id?: string
          image?: Json | null
          kind: string
          poster?: Json | null
          sort_order?: number
          video_url?: string | null
        }
        Update: {
          album_id?: string
          caption?: string | null
          created_at?: string
          id?: string
          image?: Json | null
          kind?: string
          poster?: Json | null
          sort_order?: number
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'media_album_id_fkey'
            columns: ['album_id']
            isOneToOne: false
            referencedRelation: 'albums'
            referencedColumns: ['id']
          },
        ]
      }
      packages: {
        Row: {
          created_at: string
          description: string | null
          features: Array<string>
          highlighted: boolean
          id: string
          name: string
          price_label: string
          service_id: string | null
          sort_order: number
          visible: boolean
        }
        Insert: {
          created_at?: string
          description?: string | null
          features?: Array<string>
          highlighted?: boolean
          id?: string
          name: string
          price_label?: string
          service_id?: string | null
          sort_order?: number
          visible?: boolean
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: Array<string>
          highlighted?: boolean
          id?: string
          name?: string
          price_label?: string
          service_id?: string | null
          sort_order?: number
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'packages_service_id_fkey'
            columns: ['service_id']
            isOneToOne: false
            referencedRelation: 'services'
            referencedColumns: ['id']
          },
        ]
      }
      page_content: {
        Row: { data: Json; page: string; section: string; updated_at: string }
        Insert: { data?: Json; page: string; section: string; updated_at?: string }
        Update: { data?: Json; page?: string; section?: string; updated_at?: string }
        Relationships: []
      }
      services: {
        Row: {
          body: string | null
          cover: Json | null
          created_at: string
          id: string
          slug: string
          sort_order: number
          summary: string
          title: string
          visible: boolean
        }
        Insert: {
          body?: string | null
          cover?: Json | null
          created_at?: string
          id?: string
          slug: string
          sort_order?: number
          summary?: string
          title: string
          visible?: boolean
        }
        Update: {
          body?: string | null
          cover?: Json | null
          created_at?: string
          id?: string
          slug?: string
          sort_order?: number
          summary?: string
          title?: string
          visible?: boolean
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          business_name: string
          email: string
          footer_note: string
          id: number
          location: string
          logo: Json | null
          phones: Array<string>
          seo: Json
          short_name: string
          show_packages: boolean
          show_prices: boolean
          show_testimonials: boolean
          socials: Json
          tagline: string
          updated_at: string
          whatsapp: string
        }
        Insert: {
          business_name: string
          email?: string
          footer_note?: string
          id?: number
          location?: string
          logo?: Json | null
          phones?: Array<string>
          seo?: Json
          short_name?: string
          show_packages?: boolean
          show_prices?: boolean
          show_testimonials?: boolean
          socials?: Json
          tagline?: string
          updated_at?: string
          whatsapp?: string
        }
        Update: {
          business_name?: string
          email?: string
          footer_note?: string
          id?: number
          location?: string
          logo?: Json | null
          phones?: Array<string>
          seo?: Json
          short_name?: string
          show_packages?: boolean
          show_prices?: boolean
          show_testimonials?: boolean
          socials?: Json
          tagline?: string
          updated_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar: Json | null
          client_name: string
          context: string
          created_at: string
          id: string
          quote: string
          sort_order: number
          visible: boolean
        }
        Insert: {
          avatar?: Json | null
          client_name: string
          context?: string
          created_at?: string
          id?: string
          quote: string
          sort_order?: number
          visible?: boolean
        }
        Update: {
          avatar?: Json | null
          client_name?: string
          context?: string
          created_at?: string
          id?: string
          quote?: string
          sort_order?: number
          visible?: boolean
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

type PublicTables = Database['public']['Tables']

export type Tables<T extends keyof PublicTables> = PublicTables[T]['Row']
export type TablesInsert<T extends keyof PublicTables> = PublicTables[T]['Insert']
export type TablesUpdate<T extends keyof PublicTables> = PublicTables[T]['Update']
