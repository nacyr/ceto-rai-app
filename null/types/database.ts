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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      donations: {
        Row: {
          id: string
          amount: number
          donor_id: string
          program: string | null
          status: 'pending' | 'completed' | 'failed'
          created_at: string
        }
        Insert: {
          id?: string
          amount: number
          donor_id: string
          program?: string | null
          status?: 'pending' | 'completed' | 'failed'
          created_at?: string
        }
        Update: {
          amount?: number
          donor_id?: string
          program?: string | null
          status?: 'pending' | 'completed' | 'failed'
        }
      }
      volunteers: {
        Row: {
          id: string
          user_id: string
          skills: string[]
          availability: string
          status: 'pending' | 'active' | 'inactive'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skills: string[]
          availability: string
          status?: 'pending' | 'active' | 'inactive'
          created_at?: string
        }
        Update: {
          user_id?: string
          skills?: string[]
          availability?: string
          status?: 'pending' | 'active' | 'inactive'
        }
      }
    }
  }
}
