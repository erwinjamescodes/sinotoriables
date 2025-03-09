export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      candidates: {
        Row: {
          id: number
          created_at: string
          name: string
          party: string
          platform: string
          bio: string
          image_url: string
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          party: string
          platform: string
          bio: string
          image_url: string
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          party?: string
          platform?: string
          bio?: string
          image_url?: string
        }
      }
      likes: {
        Row: {
          id: number
          created_at: string
          candidate_id: number
          ip_address: string
        }
        Insert: {
          id?: number
          created_at?: string
          candidate_id: number
          ip_address: string
        }
        Update: {
          id?: number
          created_at?: string
          candidate_id?: number
          ip_address?: string
        }
      }
    }
    Views: {
      candidates_with_likes: {
        Row: {
          id: number
          name: string
          party: string
          platform: string
          bio: string
          image_url: string
          likes_count: number
        }
      }
    }
    Functions: {
      toggle_like: {
        Args: {
          p_candidate_id: number
          p_ip_address: string
        }
        Returns: {
          liked: boolean
        }
      }
    }
  }
}

