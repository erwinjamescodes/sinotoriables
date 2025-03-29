import { getAnalyticsData } from "@/app/actions";
import { CandidateRankings } from "@/components/candidate-rankings";
import { LikesTimeline } from "@/components/likes-timeline";
import { PartyDistribution } from "@/components/party-distribution";

export const metadata = {
  title: "Statistics | SinoToriables PH",
  description:
    "Explore analytics and insights about Philippine Senate election candidates",
};

export default async function AnalyticsPage() {
  const { candidatesWithLikes, timelineData } = await getAnalyticsData();

  return (
    <div className="container py-8 px-4 sm:px-6">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Statistics & Insights
          </h1>
          <p className="text-muted-foreground">
            Explore data and trends about the Philippine Senate election
            candidates.
          </p>
        </div>

        <div className="grid gap-6">
          <div className="bg-card border rounded-lg p-4 overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4">Likes Timeline</h2>
            <div className="min-w-[320px]">
              <LikesTimeline data={timelineData} />
            </div>
          </div>

          <div className="p-4 bg-card border rounded-lg overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4">Candidate Rankings</h2>
            <div className="min-w-[320px]">
              <CandidateRankings candidates={candidatesWithLikes} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
