"use client";
import { toggleLike } from "@/app/actions";
import { CandidateCard } from "@/components/candidate-card";
import { CandidateFilters } from "@/components/candidate-filters";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import { CandidateWithLikes } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

// Moved metadata to separate page.js file

export default function CandidatesPage({
  candidatesData,
  likedCandidatesData,
}: {
  candidatesData: CandidateWithLikes[];
  likedCandidatesData: number[];
}) {
  const [viewMode, setViewMode] = useState("cards"); // 'cards' or 'ballot'
  const [candidates, setCandidates] = useState(candidatesData);
  const [likedCandidates, setLikedCandidates] = useState(likedCandidatesData);
  const [isLoading, setIsLoading] = useState<number | null>(null);
  const { toast } = useToast();

  // Maximum number of candidates a user can vote for
  const MAX_VOTES = 12;

  // Check if user has reached maximum votes
  const hasReachedMaxVotes = likedCandidates.length >= MAX_VOTES;

  // Define the number of columns
  const numColumns = 4;

  // Calculate candidates per column (ceiling division to handle uneven distribution)
  const candidatesPerColumn = Math.ceil(candidates.length / numColumns);

  // Create column arrays
  const columns = [];
  for (let i = 0; i < numColumns; i++) {
    columns.push(
      candidates.slice(
        i * candidatesPerColumn,
        Math.min((i + 1) * candidatesPerColumn, candidates.length)
      )
    );
  }

  const handleLike = async (candidateId: number, candidateName: string) => {
    // Check if this is an unlike action (already liked) or if user hasn't reached max votes
    const isCurrentlyLiked = likedCandidates.includes(candidateId);

    // If trying to like a new candidate but already at max votes, show warning and return
    if (!isCurrentlyLiked && hasReachedMaxVotes) {
      toast({
        title: "Maximum votes reached",
        description: `You can only vote for up to ${MAX_VOTES} candidates. Please remove a vote before adding another.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(candidateId);
    try {
      // Toggle like state optimistically
      const newLikedCandidates = isCurrentlyLiked
        ? likedCandidates.filter((id) => id !== candidateId)
        : [...likedCandidates, candidateId];

      // Update UI immediately for better UX
      setLikedCandidates(newLikedCandidates);

      // Update like count in candidates array
      setCandidates((prevCandidates) =>
        prevCandidates.map((candidate) => {
          if (candidate.id === candidateId) {
            return {
              ...candidate,
              like_count: Math.max(
                0,
                (candidate.like_count || 0) + (isCurrentlyLiked ? -1 : 1)
              ),
            };
          }
          return candidate;
        })
      );

      // Make the API call
      const result = await toggleLike(candidateId);

      // Confirm state based on server response
      const serverIsLiked = result.action === "liked";

      // If server result doesn't match our optimistic update, fix it
      if (serverIsLiked !== !isCurrentlyLiked) {
        const updatedLikedCandidates = serverIsLiked
          ? [...likedCandidates.filter((id) => id !== candidateId), candidateId]
          : likedCandidates.filter((id) => id !== candidateId);

        setLikedCandidates(updatedLikedCandidates);

        // Fix the like count in the candidates array
        setCandidates((prevCandidates) =>
          prevCandidates.map((candidate) => {
            if (candidate.id === candidateId) {
              return {
                ...candidate,
                like_count: Math.max(
                  0,
                  (candidate.like_count || 0) +
                    (serverIsLiked ? 1 : -1) -
                    (isCurrentlyLiked ? -1 : 1)
                ),
              };
            }
            return candidate;
          })
        );
      }

      // Show appropriate toast message
      toast({
        title: serverIsLiked ? "Voted!" : "Vote removed",
        description: serverIsLiked
          ? `You've successfully voted for ${candidateName}. ${newLikedCandidates.length}/${MAX_VOTES} votes used.`
          : `You've removed your vote for ${candidateName}. ${newLikedCandidates.length}/${MAX_VOTES} votes used.`,
        className: serverIsLiked
          ? "border-t-0 border-l-0 border-r-0 border-b-4 border-green-500 mb-2"
          : "border-t-0 border-l-0 border-r-0 border-b-4 border-red-500 mb-2",
        duration: 1000, // Close after 3 seconds
      });
    } catch (error) {
      console.error("Like error:", error);

      // Revert optimistic update on error
      const isCurrentlyLiked = likedCandidates.includes(candidateId);
      const revertedLikedCandidates = isCurrentlyLiked
        ? likedCandidates.filter((id) => id !== candidateId)
        : [...likedCandidates, candidateId];

      setLikedCandidates(revertedLikedCandidates);

      // Revert the like count in candidates array
      setCandidates((prevCandidates) =>
        prevCandidates.map((candidate) => {
          if (candidate.id === candidateId) {
            return {
              ...candidate,
              like_count: Math.max(
                0,
                (candidate.like_count || 0) + (isCurrentlyLiked ? 1 : -1)
              ),
            };
          }
          return candidate;
        })
      );

      toast({
        title: "Error",
        description: "There was an error processing your like.",
        variant: "destructive",
        duration: 1000, // Close after 3 seconds
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="py-8 w-full">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Senatorial Candidates
            </h1>
            <p className="text-muted-foreground">
              Browse and learn about the candidates running for the Philippine
              Senate.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <p
              className={`text-lg font-bold ${
                hasReachedMaxVotes ? "text-red-500" : "text-green-500"
              }`}
            >
              {likedCandidates.length}/{MAX_VOTES} votes used
            </p>
            {likedCandidates.length > 0 && (
              <Button variant="outline" size="sm" asChild>
                <Link href="/my-list" className="flex items-center gap-2">
                  View My List
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-row justify-between gap-4">
          <CandidateFilters />
          <div className="flex items-center space-x-0">
            <Button
              variant={viewMode === "cards" ? "default" : "secondary"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="flex items-center"
            >
              <LayoutGrid className="w-4 h-4 mr-1" />
              Cards View
            </Button>
            <Button
              variant={viewMode === "ballot" ? "default" : "secondary"}
              size="sm"
              onClick={() => setViewMode("ballot")}
              className="flex items-center"
            >
              <List className="w-4 h-4 mr-1" />
              Ballot View
            </Button>
          </div>
        </div>

        <div className="w-full mx-auto">
          {viewMode === "cards" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {candidates.map((candidate) => {
                const isLiked = likedCandidates.includes(candidate.id);
                const canVote = isLiked || !hasReachedMaxVotes;

                return (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    isLiked={isLiked}
                    disabled={!canVote}
                    onLike={handleLike}
                  />
                );
              })}
            </div>
          )}

          {viewMode === "ballot" && (
            <div>
              <div className="flex flex-col h-24 w-full bg-green-100 border border-b-0 border-black items-center justify-center">
                <p>SENATOR / Vote for 12</p>
                <p>(Bumoto ng hindi hihigit sa 12)</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 border-t border-l border-black">
                {columns.map((columnCandidates, columnIndex) => (
                  <div key={columnIndex} className="flex flex-col">
                    {columnCandidates.map((candidate, candidateIndex) => {
                      const isLiked = likedCandidates.includes(candidate.id);
                      const canVote = isLiked || !hasReachedMaxVotes;

                      // Determine if this is the last column
                      const isLastColumn = columnIndex === columns.length - 1;
                      // Determine if this is the last item in the column
                      const isLastInColumn =
                        candidateIndex === columnCandidates.length - 1;

                      return (
                        <div
                          key={candidate.id}
                          className={`flex items-center border-r border-b border-black p-2 hover:bg-gray-50 ${
                            isLiked ? "bg-gray-100" : ""
                          } ${!canVote ? "opacity-50" : ""}`}
                        >
                          <div
                            onClick={() =>
                              canVote &&
                              handleLike(candidate.id, candidate.name)
                            }
                            className={`w-6 h-6 flex items-center justify-center border-2 border-black rounded-full mr-2 ${
                              canVote ? "cursor-pointer" : "cursor-not-allowed"
                            } transition-all duration-300 ease-in-out ${
                              isLiked ? "bg-black" : ""
                            }`}
                          />
                          <div className="font-medium">
                            {candidate.id}. {candidate.name}{" "}
                            <span className="text-gray-500 text-xs uppercase">
                              (
                              {candidate.party === "Independent"
                                ? "IND"
                                : candidate.party}
                              )
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
