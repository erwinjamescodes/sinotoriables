import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export type Candidate = Database["public"]["Tables"]["candidates"]["Row"]
export type Like = Database["public"]["Tables"]["likes"]["Row"]
export type CandidateWithLikes = Candidate & { like_count: number }
