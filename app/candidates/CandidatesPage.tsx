"use client";
import { toggleLike } from "@/app/actions";
import { CandidateCard } from "@/components/candidate-card";
import { CandidateFilters } from "@/components/candidate-filters";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutGrid,
  List,
  UserRoundCheck,
  ChevronUp,
  CheckCircle,
} from "lucide-react";
import { CandidateWithLikes } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [isMobile, setIsMobile] = useState(false);
  const [showCongratulationsModal, setShowCongratulationsModal] =
    useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Check if we're on mobile on component mount and when window resizes
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Check on mount
    checkIsMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIsMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Scroll to top function for "Back to top" button
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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

      // Show congratulations modal when user reaches MAX_VOTES
      if (serverIsLiked && newLikedCandidates.length === MAX_VOTES) {
        setShowCongratulationsModal(true);
      }
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

  // Component for the view toggle buttons
  const ViewToggle = () => (
    <div className="relative flex items-center p-0 bg-gray-100 rounded-lg overflow-hidden">
      {/* Background slider that moves based on the active view */}
      <div
        className={`absolute top-1 bottom-1 w-1/2 bg-black rounded-md transition-all duration-300 ease-in-out ${
          viewMode === "cards" ? "left-1" : "left-[calc(50%-1px)]"
        }`}
      />

      {/* Cards view button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setViewMode("cards")}
        className={`relative z-10 flex items-center justify-center w-1/2 rounded-md transition-colors duration-300 hover:bg-transparent ${
          viewMode === "cards"
            ? "text-white hover:text-white"
            : "text-gray-700 hover:text-gray-700"
        }`}
      >
        <LayoutGrid className="w-4 h-4 mr-1" />
        Cards View
      </Button>

      {/* Ballot view button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setViewMode("ballot")}
        className={`relative z-10 flex items-center justify-center w-1/2 rounded-md transition-colors duration-300 hover:bg-transparent ${
          viewMode === "ballot"
            ? "text-white hover:text-white"
            : "text-gray-700 hover:text-gray-700"
        }`}
      >
        <List className="w-4 h-4 mr-1" />
        Ballot View
      </Button>
    </div>
  );

  return (
    <div className=" w-full relative">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Senatorial Candidates
            </h1>
            <p className="text-muted-foreground">
              Browse and learn about the candidates running for the Philippine
              Senate.
            </p>
          </div>
          {/* Only show view toggle in header for desktop */}
          {!isMobile && <ViewToggle />}
        </div>

        <div className="flex flex-row justify-between items-center gap-4">
          <div className="flex-1">
            <CandidateFilters />
          </div>
          <div className="flex-shrink-0">
            <Button variant="outline" onClick={() => router.push("/my-list")}>
              <UserRoundCheck className="w-4 h-4 mr-0 md:mr-2 " />
              <span className="hidden md:block">
                My List ({likedCandidates.length}/{MAX_VOTES})
              </span>
              <span className="block md:hidden">
                {likedCandidates.length}/{MAX_VOTES}
              </span>
            </Button>
          </div>
        </div>

        <div className="w-full mx-auto mb-20 sm:mb-0">
          {viewMode === "cards" && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
            <div className="w-full">
              <div className="flex flex-col h-24 w-full bg-green-100 border border-b-0 border-black items-center justify-center rounded-t-lg">
                <p>SENATOR / Vote for 12</p>
                <p>(Bumoto ng hindi hihigit sa 12)</p>
              </div>
              <div className="overflow-x-auto">
                <div className="md:min-w-[640px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 border-t border-l border-black">
                  {columns.map((columnCandidates, columnIndex) => (
                    <div key={columnIndex} className="flex flex-col">
                      {columnCandidates.map((candidate, candidateIndex) => {
                        const isLiked = likedCandidates.includes(candidate.id);
                        const canVote = isLiked || !hasReachedMaxVotes;

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
                                canVote
                                  ? "cursor-pointer"
                                  : "cursor-not-allowed"
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
            </div>
          )}
        </div>
      </div>

      {/* Fixed bottom navigation for mobile view */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-white border-t shadow-md z-50 flex justify-between items-center">
          {/* View toggle on the left side */}
          <div className="w-2/3 max-w-xs">
            <ViewToggle />
          </div>

          {/* Back to top button on the right side */}
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={scrollToTop}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Congratulations Modal */}
      <Dialog
        open={showCongratulationsModal}
        onOpenChange={setShowCongratulationsModal}
      >
        <DialogContent className="sm:max-w-md w-[90%] rounded-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center text-xl font-bold">
              {/* <CheckCircle className="h-6 w-6 text-green-500 mr-2" /> */}
              Congratulations!
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              You have completed your 12/12 votes for the senatorial candidates.
              Thank you for participating in this democratic exercise!
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCongratulationsModal(false)}
              className="sm:mr-2 w-full sm:w-auto"
            >
              Modify Votes
            </Button>
            <Button
              type="button"
              onClick={() => router.push("/my-list")}
              className="w-full sm:w-auto"
            >
              View My List
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
