"use client";
import { useState, useRef, useEffect } from "react";
import { CandidateWithLikes } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Camera } from "lucide-react";
import html2canvas from "html2canvas";

export default function MyListPage({
  likedCandidatesData,
  likedCandidateIds,
}: {
  likedCandidatesData: CandidateWithLikes[];
  likedCandidateIds: number[];
}) {
  const [candidates] = useState(likedCandidatesData);
  const [likedCandidates] = useState(likedCandidateIds);
  const [isCapturing, setIsCapturing] = useState(false);
  const { toast } = useToast();
  const ballotRef = useRef<HTMLDivElement>(null);

  // Maximum number of candidates a user can vote for
  const MAX_VOTES = 12;

  // Sort candidates by ID to maintain consistent order
  const sortedCandidates = [...candidates].sort((a, b) => a.id - b.id);

  const captureAndDownload = async () => {
    if (!ballotRef.current) return;

    try {
      setIsCapturing(true);

      const canvas = await html2canvas(ballotRef.current, {
        scale: 2, // Higher resolution
        backgroundColor: "#ffffff",
        logging: false,
        useCORS: true,
      });

      // Convert to data URL and download
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      const link = document.createElement("a");
      link.download = `my-ballot-${new Date().toISOString().split("T")[0]}.jpg`;
      link.href = dataUrl;
      link.click();

      toast({
        title: "Success!",
        description: "Your ballot has been saved as a JPG image.",
        className:
          "border-t-0 border-l-0 border-r-0 border-b-4 border-green-500 mb-2",
        duration: 1000, // Close after 3 seconds
      });
    } catch (error) {
      console.error("Error capturing ballot:", error);
      toast({
        title: "Error",
        description: "There was an error saving your ballot as an image.",
        variant: "destructive",
        duration: 1000, // Close after 3 seconds
      });
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">My List</h1>
            <p className="text-muted-foreground">
              Candidates you've voted for. Keep this list for reference on
              election day.
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Link href="/candidates">
            <Button variant="outline" className="gap-2">
              <ArrowLeft size={16} />
              Back to All Candidates
            </Button>
          </Link>{" "}
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={captureAndDownload}
            disabled={isCapturing || candidates.length === 0}
          >
            {isCapturing ? "Processing..." : "Save List as Image"}
            {!isCapturing && <Camera size={16} />}
          </Button>
        </div>

        {candidates.length === 0 ? (
          <div className="py-12 text-center">
            <h2 className="text-xl font-medium mb-2">
              You haven't voted for any candidates yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Go to the candidates page to vote for your preferred candidates.
            </p>
            <Link href="/candidates">
              <Button>Browse Candidates</Button>
            </Link>
          </div>
        ) : (
          <div ref={ballotRef}>
            <div className="flex flex-col h-24 w-full bg-green-100 border border-b-0 border-black items-start justify-center pl-4">
              <p className="text-lg font-semibold">My 2025 Senators</p>
              <p>(Mga kandidatong iyong pinili)</p>
            </div>
            <div className="border-t border-l border-black">
              {/* Single column layout */}
              <div className="flex flex-col w-full">
                {sortedCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="flex items-center border-r border-b border-black p-3 bg-gray-100"
                  >
                    <div className="w-6 h-6 min-w-6 flex items-center justify-center border-2 border-black rounded-full bg-black mr-3" />
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
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
