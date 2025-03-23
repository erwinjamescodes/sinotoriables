"use client";
import { getCandidates, getUserLikes, toggleLike } from "@/app/actions";
import { CandidateCard } from "@/components/candidate-card";
import { CandidateFilters } from "@/components/candidate-filters";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import { CandidateWithLikes } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

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

  const handleLike = async (candidateId: number) => {
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
          ? `You've successfully voted this candidate. ${newLikedCandidates.length}/${MAX_VOTES} votes used.`
          : `You've removed your vote from this candidate. ${newLikedCandidates.length}/${MAX_VOTES} votes used.`,
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
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Senate Candidates
            </h1>
            <p className="text-muted-foreground">
              Browse and learn about the candidates running for the Philippine
              Senate.
            </p>
            <p className="text-sm font-medium text-primary">
              You can vote for up to {MAX_VOTES} candidates.
              <span
                className={`${
                  hasReachedMaxVotes ? "text-red-500" : "text-green-500"
                }`}
              >
                {likedCandidates.length}/{MAX_VOTES} votes used
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-row justify-between gap-4">
          <CandidateFilters />
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="flex items-center"
            >
              <LayoutGrid className="w-4 h-4 mr-1" />
              Cards
            </Button>
            <Button
              variant={viewMode === "ballot" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("ballot")}
              className="flex items-center"
            >
              <List className="w-4 h-4 mr-1" />
              Ballot
            </Button>
          </div>
        </div>

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
          <>
            {/* <div className="flex flex-col h-10 w-full bg-red-200"></div>{" "} */}
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
                          onClick={() => canVote && handleLike(candidate.id)}
                          className={`w-6 h-6 flex items-center justify-center border-2 border-black rounded-full mr-2 ${
                            canVote ? "cursor-pointer" : "cursor-not-allowed"
                          } transition-all duration-300 ease-in-out ${
                            isLiked ? "bg-black" : ""
                          }`}
                        />
                        <div className="font-medium">
                          {candidate.id}. {candidate.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
