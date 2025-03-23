"use client";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { CandidateWithLikes } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

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
      } ${disabled && !isLiked ? "opacity-50" : ""}`}
    >
      <div className="aspect-[3/4] relative group hover:cursor-pointer">
        <Image
          src={candidate.photo_url || `/placeholder.svg?height=400&width=300`}
          alt={candidate.name}
          fill
          className={`object-cover filter transition-all duration-300 ease-in-out ${
            isLiked ? "grayscale-0" : "grayscale"
          }`}
        />
      </div>
      <CardContent className="p-4">
        <div className=" flex items-center gap-2">
          <div
            onClick={handleLike}
            className={`h-4 w-4 border-2 rounded-full border-black ${
              isLiked ? "bg-black text-white" : ""
            } ${
              disabled && !isLiked ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          />
          <h3 className="font-medium text-lg flex items-center gap-2">
            {candidate.id}. {candidate.name}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">{candidate.party}</p>
        <p className="mt-2 text-sm line-clamp-3">{candidate.bio}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Link
          href={`/candidates/${candidate.id}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          View Profile
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 hover:bg-transparent cursor-default"
          disabled={isLoading}
        >
          <span>Votes: {candidate.like_count || 0}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
