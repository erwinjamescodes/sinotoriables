"use client";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { CandidateWithLikes } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Vote, CircleUser } from "lucide-react";
import { useRouter } from "next/navigation";
// import { Vote } from "lucide-react";

interface CandidateCardProps {
  candidate: CandidateWithLikes;
  isLiked?: boolean;
  disabled?: boolean;
  onLike?: (candidateId: number, candidateName: string) => Promise<void>;
}

export function CandidateCard({
  candidate,
  isLiked = false,
  disabled = false,
  onLike,
}: CandidateCardProps) {
  // Use the isLiked prop directly instead of maintaining internal state
  // This ensures the component reflects the parent's state
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Handle the like action by calling the parent's onLike function
  const handleLike = async () => {
    // If disabled and not already liked, don't allow new likes
    if (disabled && !isLiked) {
      return;
    }

    if (onLike) {
      setIsLoading(true);
      try {
        await onLike(candidate.id, candidate.name);
      } catch (error) {
        console.error("Error in CandidateCard handleLike:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card
      className={`overflow-hidden ${
        isLiked ? "border-primary border-2 border-black" : ""
      } ${
        disabled && !isLiked
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer"
      } `}
    >
      <div className="aspect-[3/4] relative group ">
        <Image
          src={candidate.photo_url || `/placeholder.svg?height=400&width=300`}
          alt={candidate.name}
          fill
          className={`object-cover filter transition-all duration-300 ease-in-out  ${
            isLiked ? "grayscale-0" : "grayscale"
          } ${disabled && !isLiked ? "" : "hover:grayscale-0"}`}
        />
      </div>
      <CardContent className="p-2 md:p-4">
        <div className=" flex md:items-center gap-2">
          <div
            onClick={handleLike}
            className={`h-4 w-4 border-2 mt-[2px] md:mt-0 rounded-full border-black ${
              isLiked ? "bg-black text-white" : ""
            }`}
          />
          <h3 className="font-medium text-sm md:text-lg flex items-center gap-2">
            {candidate.id}. {candidate.name}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground pl-6">{candidate.party}</p>
        <p className="mt-2 text-sm line-clamp-3">{candidate.bio}</p>
      </CardContent>
      <CardFooter className="p-2 md:p-4 pt-0 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className={`text-sm font-medium p-0 border-0 flex flex-row gap-1 items-center hover:bg-transparent ${
            disabled && !isLiked
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          }`}
          onClick={() => {
            router.push(`/candidates/${candidate.id}`);
          }}
        >
          <CircleUser className="w-4 h-4" />
          View Profile
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 hover:bg-transparent cursor-default"
          disabled={isLoading}
        >
          <span className="hidden md:block">
            Votes: {candidate.like_count || 0}
          </span>
          <span className="md:hidden flex items-center gap-1">
            <Vote className="w-4 h-4" /> {candidate.like_count || 0}
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
}
