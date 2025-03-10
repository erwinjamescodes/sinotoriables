import { getAnalyticsData } from "@/app/actions";
import { CandidateRankings } from "@/components/candidate-rankings";
import { LikesTimeline } from "@/components/likes-timeline";
import { PartyDistribution } from "@/components/party-distribution";

export const metadata = {
  title: "Analytics | SinoToriables PH",
  description:
    "Explore analytics and insights about Philippine Senate election candidates",
};

export default async function AnalyticsPage() {
  const { candidatesWithLikes, timelineData } = await getAnalyticsData();

  return (
    <div className="container py-8">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Analytics & Insights
          </h1>
          <p className="text-muted-foreground">
            Explore data and trends about the Philippine Senate election
            candidates.
          </p>
        </div>

        {/* <div className="grid gap-6 md:grid-cols-2"> */}
        <div className="">
          <div className="p-6 bg-card rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Likes Timeline</h2>
            <LikesTimeline data={timelineData} />
          </div>

          {/* <div className="p-6 bg-card rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Party Distribution</h2>
            <PartyDistribution candidates={candidatesWithLikes} />
          </div> */}
        </div>

        <div className="p-6 bg-card rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Candidate Rankings</h2>
          <CandidateRankings candidates={candidatesWithLikes} />
        </div>
      </div>
    </div>
  );
}
