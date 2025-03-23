"use client";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { CandidateWithLikes } from "@/lib/supabase";
import { useState } from "react";
import { toggleLike } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface CandidateCardProps {
  candidate: CandidateWithLikes;
  isLiked?: boolean;
}

export function CandidateCard({
  candidate,
  isLiked = false,
}: CandidateCardProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(candidate.like_count || 0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLike = async () => {
    setIsLoading(true);
    try {
      // Toggle like state optimistically
      const newIsLiked = !liked;
      const likeDelta = newIsLiked ? 1 : -1;

      // Update UI immediately for better UX
      setLiked(newIsLiked);
      setLikes((prev) => Math.max(0, prev + likeDelta));

      // Make the API call
      const result = await toggleLike(candidate.id);

      // Confirm state based on server response
      const serverIsLiked = result.action === "liked";

      // If server result doesn't match our optimistic update, fix it
      if (serverIsLiked !== newIsLiked) {
        setLiked(serverIsLiked);
        setLikes((prev) =>
          Math.max(0, prev + (serverIsLiked ? 1 : -1) - likeDelta)
        );
      }

      // Show appropriate toast message
      toast({
        title: serverIsLiked ? "Liked!" : "Like removed",
        description: serverIsLiked
          ? "You've successfully liked this candidate."
          : "You've removed your like from this candidate.",
      });
    } catch (error) {
      console.error("Like error:", error);

      // Revert optimistic update on error
      setLiked(!liked);
      setLikes((prev) => Math.max(0, prev + (liked ? 1 : -1)));

      toast({
        title: "Error",
        description: "There was an error processing your like.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      className={`overflow-hidden  ${
        liked ? "border-primary border-2 border-black" : ""
      }`}
    >
      <div className="aspect-[3/4] relative group hover:cursor-pointer">
        <Image
          src={candidate.photo_url || `/placeholder.svg?height=400&width=300`}
          alt={candidate.name}
          fill
          className={`object-cover filter transition-all duration-300 ease-in-out ${
            liked ? "grayscale-0" : "grayscale"
          }`}
        />
      </div>
      <CardContent className="p-4">
        <div className=" flex items-center gap-2">
          <div
            onClick={handleLike}
            className={`h-4 w-4 border-2 rounded-full border-black ${
              liked ? "bg-black text-white" : ""
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
          <span>Votes: {likes}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
