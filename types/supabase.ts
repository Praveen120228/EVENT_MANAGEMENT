export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          date: string
          time: string | null
          location: string | null
          organizer_id: string
          max_guests: number | null
          created_at: string
          updated_at: string
          organizer_name: string | null
          invitation_code: string | null
          profiles?: {
            id: string
            email: string
            name: string | null
            full_name?: string
            created_at: string
            updated_at: string
          }
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          date: string
          time?: string | null
          location?: string | null
          organizer_id: string
          max_guests?: number | null
          created_at?: string
          updated_at?: string
          organizer_name?: string | null
          invitation_code?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          date?: string
          time?: string | null
          location?: string | null
          organizer_id?: string
          max_guests?: number | null
          created_at?: string
          updated_at?: string
          organizer_name?: string | null
          invitation_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      subscription_orders: {
        Row: {
          id: string
          order_id: string
          user_id: string
          plan_id: string
          interval: string
          amount: number
          status: string
          receipt: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          order_id: string
          user_id: string
          plan_id: string
          interval: string
          amount: number
          status: string
          receipt: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          order_id?: string
          user_id?: string
          plan_id?: string
          interval?: string
          amount?: number
          status?: string
          receipt?: string
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_orders_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      },
      subscriptions: {
        Row: {
          id: string
          user_id: string
          status: string
          plan_id: string
          current_period_start: string
          current_period_end: string
          created_at: string
          updated_at: string
          canceled_at: string | null
          trial_start: string | null
          trial_end: string | null
        }
        Insert: {
          id?: string
          user_id: string
          status: string
          plan_id: string
          current_period_start: string
          current_period_end: string
          created_at?: string
          updated_at?: string
          canceled_at?: string | null
          trial_start?: string | null
          trial_end?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          plan_id?: string
          current_period_start?: string
          current_period_end?: string
          created_at?: string
          updated_at?: string
          canceled_at?: string | null
          trial_start?: string | null
          trial_end?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      },
      guests: {
        Row: {
          id: string
          event_id: string
          name: string
          email: string
          status: 'pending' | 'confirmed' | 'declined'
          response_date: string | null
          message: string | null
          created_at: string
          updated_at: string
          event?: {
            id: string
            title: string
            description: string | null
            date: string
            time: string | null
            location: string | null
            organizer_id: string
            max_guests: number | null
            created_at: string
            updated_at: string
            organizer_name: string | null
            invitation_code: string | null
            profiles?: {
              id: string
              email: string
              name: string | null
              full_name?: string
              created_at: string
              updated_at: string
            }
          }
        }
        Insert: {
          id?: string
          event_id: string
          name: string
          email: string
          status?: 'pending' | 'confirmed' | 'declined'
          response_date?: string | null
          message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          name?: string
          email?: string
          status?: 'pending' | 'confirmed' | 'declined'
          response_date?: string | null
          message?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guests_event_id_fkey"
            columns: ["event_id"]
            referencedRelation: "events"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          full_name?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          full_name?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          full_name?: string
          created_at?: string
          updated_at?: string
        }
      }
      _prisma_migrations: {
        Row: {
          id: string
          checksum: string
          finished_at: string | null
          migration_name: string
          logs: string | null
          rolled_back_at: string | null
          started_at: string
          applied_steps_count: number
        }
        Insert: {
          id: string
          checksum: string
          finished_at?: string | null
          migration_name: string
          logs?: string | null
          rolled_back_at?: string | null
          started_at?: string
          applied_steps_count?: number
        }
        Update: {
          id?: string
          checksum?: string
          finished_at?: string | null
          migration_name?: string
          logs?: string | null
          rolled_back_at?: string | null
          started_at?: string
          applied_steps_count?: number
        }
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
  }
}
