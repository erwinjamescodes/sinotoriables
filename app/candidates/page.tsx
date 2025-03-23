import { getCandidates, getUserLikes } from "@/app/actions";
import CandidatesPage from "./CandidatesPage";

export const metadata = {
  title: "Candidates | SinoToriables PH",
  description: "Browse and learn about Philippine Senate election candidates",
};

export default async function Page() {
  const candidates = await getCandidates();

  // Fetch all user likes once
  const candidateIds = candidates.map((candidate) => candidate.id);
  const { likedCandidates } = await getUserLikes(candidateIds);

  return (
    <div className="px-24 w-full">
      <CandidatesPage
        candidatesData={candidates}
        likedCandidatesData={likedCandidates}
      />
    </div>
  );
}
