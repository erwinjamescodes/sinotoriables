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
}: {
  likedCandidatesData: CandidateWithLikes[];
}) {
  const [candidates] = useState(likedCandidatesData);
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

      // Define portrait mobile dimensions (width: 390px, height: 844px - iPhone 12/13 Pro size)
      const mobileWidth = 390;
      const mobileHeight = 844;

      // Create a temporary container with mobile dimensions
      const tempContainer = document.createElement("div");
      tempContainer.style.width = `${mobileWidth}px`;
      tempContainer.style.height = `${mobileHeight}px`;
      tempContainer.style.position = "absolute";
      tempContainer.style.top = "-9999px";
      tempContainer.style.backgroundColor = "#ffffff";
      tempContainer.style.padding = "20px";
      tempContainer.style.boxSizing = "border-box";
      document.body.appendChild(tempContainer);

      // Create the ballot content specifically for the mobile view
      const mobileContent = document.createElement("div");
      mobileContent.style.width = "100%";
      mobileContent.style.display = "flex";
      mobileContent.style.flexDirection = "column";

      // Header with styling
      const header = document.createElement("div");
      header.style.display = "flex";
      header.style.flexDirection = "column";
      header.style.width = "100%";
      header.style.backgroundColor = "#e6f7ec"; // Light green background
      header.style.borderWidth = "1px";
      header.style.borderStyle = "solid";
      header.style.borderColor = "#000";
      header.style.borderBottomWidth = "0";
      header.style.padding = "12px";
      header.style.marginBottom = "0";

      const title = document.createElement("p");
      title.style.fontSize = "18px";
      title.style.fontWeight = "600";
      title.style.margin = "0";
      title.textContent = "My 2025 Senators";
      header.appendChild(title);
      mobileContent.appendChild(header);

      // Candidates list
      const candidatesList = document.createElement("div");
      candidatesList.style.border = "1px solid #000";
      candidatesList.style.borderTop = "0";
      candidatesList.style.width = "100%";

      // Clone and process sorted candidates
      const sortedCandidatesCopy = [...candidates].sort((a, b) => a.id - b.id);

      sortedCandidatesCopy.forEach((candidate) => {
        const item = document.createElement("div");
        item.style.display = "flex";
        item.style.alignItems = "center";
        item.style.padding = "12px";
        item.style.borderBottom = "1px solid #000";

        const text = document.createElement("div");
        text.style.fontWeight = "500";
        text.innerHTML = `${candidate.id}. ${
          candidate.name
        } <span style="color: #6b7280; font-size: 12px; text-transform: uppercase;">(${
          candidate.party === "Independent" ? "IND" : candidate.party
        })</span>`;

        item.appendChild(text);
        candidatesList.appendChild(item);
      });

      mobileContent.appendChild(candidatesList);

      // Add watermark/footer
      const footer = document.createElement("div");
      footer.style.marginTop = "20px";
      footer.style.textAlign = "center";
      footer.style.color = "#6b7280";
      footer.style.fontSize = "14px";
      footer.textContent = `Sinotoriables PH`;
      mobileContent.appendChild(footer);

      // Add the mobile content to the container
      tempContainer.appendChild(mobileContent);

      // Capture the image
      const canvas = await html2canvas(tempContainer, {
        scale: 2, // Higher resolution
        width: mobileWidth,
        height: mobileHeight,
        backgroundColor: "#ffffff",
        logging: false,
        useCORS: true,
      });

      // Remove temporary container
      document.body.removeChild(tempContainer);

      // Convert to data URL and download
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      const link = document.createElement("a");
      link.download = `sinotoriables-my-ballot-${
        new Date().toISOString().split("T")[0]
      }.jpg`;
      link.href = dataUrl;
      link.click();

      toast({
        title: "Success!",
        description: "Your sample ballot has been saved. Vote wisely!",
        className:
          "border-t-0 border-l-0 border-r-0 border-b-4 border-green-500 mb-2",
        duration: 1000,
      });
    } catch (error) {
      console.error("Error capturing ballot:", error);
      toast({
        title: "Error",
        description: "There was an error saving your ballot as an image.",
        variant: "destructive",
        duration: 1000,
      });
    } finally {
      setIsCapturing(false);
    }
  };
  return (
    <div className="container py-8 h-full w-full">
      <div className="flex flex-col gap-6h-full w-full ">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">My List</h1>
            <p className="text-muted-foreground">
              Candidates you've voted for. Keep this list for reference on
              election day.
            </p>
          </div>
          <div className="flex justify-between items-center gap-2">
            <Link href="/candidates">
              <Button variant="outline" className="gap-2">
                <ArrowLeft size={16} />
                Back to All Candidates
              </Button>
            </Link>
            <Button
              variant="outline"
              className="gap-2"
              onClick={captureAndDownload}
              disabled={isCapturing || candidates.length === 0}
            >
              {isCapturing ? "Processing..." : "Save List as Image"}
              {!isCapturing && <Camera size={16} />}
            </Button>
          </div>
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
            <div className="flex flex-col h-12 w-full bg-green-100 border border-b-0 border-black items-start justify-center pl-4">
              <p className="text-lg font-semibold">My 2025 Senators</p>
            </div>
            <div className="border-t border-l border-black">
              {/* Single column layout */}
              <div className="flex flex-col w-full">
                {sortedCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="flex items-center border-r border-b border-black p-3 "
                  >
                    {/* <div className="w-6 h-6 min-w-6 flex items-center justify-center border-2 border-black rounded-full bg-black mr-3" /> */}
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
