import { supabase } from "@/lib/supabase"

export async function StatsSection() {
  // Fetch total candidates
  const { count: totalCandidates } = await supabase.from("candidates").select("*", { count: "exact", head: true })

  // Fetch total likes
  const { count: totalLikes } = await supabase.from("likes").select("*", { count: "exact", head: true })

  // Fetch most liked candidate
  const { data: topCandidate } = await supabase
    .from("candidates_with_likes")
    .select("name, likes_count")
    .order("likes_count", { ascending: false })
    .limit(1)
    .single()

  const stats = [
    { label: "Total Candidates", value: totalCandidates || 0 },
    { label: "Total Likes", value: totalLikes || 0 },
    { label: "Most Popular", value: topCandidate?.name || "N/A" },
    { label: "Days Until Election", value: "120" }, // This would be calculated dynamically in a real app
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
      {stats.map((stat, index) => (
        <div key={index} className="flex flex-col items-center justify-center p-4 bg-card rounded-lg shadow-sm">
          <span className="text-3xl font-bold">{stat.value}</span>
          <span className="text-sm text-muted-foreground">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}

