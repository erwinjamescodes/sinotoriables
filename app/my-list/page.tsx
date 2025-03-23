import { getCandidates, getUserLikes } from "@/app/actions";
import MyListPage from "./MyListPage";

export const metadata = {
  title: "My List | SinoToriables PH",
  description: "View the candidates you've voted for",
};

export default async function Page() {
  const candidates = await getCandidates();

  // Fetch all user likes once
  const candidateIds = candidates.map((candidate) => candidate.id);
  const { likedCandidates } = await getUserLikes(candidateIds);

  // Filter candidates to only include those that the user has liked
  const likedCandidatesData = candidates.filter((candidate) =>
    likedCandidates.includes(candidate.id)
  );

  return (
    <div className="">
      <MyListPage
        likedCandidatesData={likedCandidatesData}
        likedCandidateIds={likedCandidates}
      />
    </div>
  );
}
