import { supabase } from "@/lib/supabase";

export async function StatsSection() {
  // Fetch total candidates
  const { count: totalCandidates } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true });

  // Fetch total likes
  const { count: totalLikes } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true });

  // Fetch most liked candidate
  const { data: topCandidate } = await supabase
    .from("candidates_with_likes")
    .select("name, like_count")
    .order("like_count", { ascending: false })
    .limit(1)
    .single();

  // Calculate days until election (May 12, 2025)
  const today = new Date();
  const electionDate = new Date("2025-05-12T00:00:00+08:00");
  const timeDiff = electionDate.getTime() - today.getTime();
  const daysUntilElection = Math.ceil(timeDiff / (1000 * 3600 * 24));

  const stats = [
    { label: "Total Candidates", value: totalCandidates || 0 },
    { label: "Total Likes", value: totalLikes || 0 },
    { label: "Most Popular", value: topCandidate?.name || "N/A" },
    { label: "Days Until Election", value: daysUntilElection.toString() },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center p-4 bg-card rounded-lg shadow-sm"
        >
          <span className="text-3xl font-bold text-center">{stat.value}</span>
          <span className="text-sm text-muted-foreground">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
