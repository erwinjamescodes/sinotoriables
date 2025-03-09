import { getCandidates, getUserLikes } from "@/app/actions";
import { CandidateCard } from "@/components/candidate-card";
import { CandidateFilters } from "@/components/candidate-filters";

export const metadata = {
  title: "Candidates | SinoToriables 2025 PH",
  description: "Browse and learn about Philippine Senate election candidates",
};

export default async function CandidatesPage() {
  const candidates = await getCandidates();

  // Fetch all user likes once
  const candidateIds = candidates.map((candidate) => candidate.id);
  const { likedCandidates } = await getUserLikes(candidateIds);

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Senate Candidates
          </h1>
          <p className="text-muted-foreground">
            Browse and learn about the candidates running for the Philippine
            Senate.
          </p>
        </div>

        <CandidateFilters />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              isLiked={likedCandidates.includes(candidate.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
