"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleLike } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

interface LikeButtonProps {
  candidateId: number;
  initialLikes: number;
  isLiked: boolean;
}

export function LikeButton({
  candidateId,
  initialLikes,
  isLiked: initialIsLiked,
}: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLike = async () => {
    setIsLoading(true);
    try {
      // Toggle like state optimistically
      const newIsLiked = !isLiked;
      const likeDelta = newIsLiked ? 1 : -1;

      // Update UI immediately for better UX
      setIsLiked(newIsLiked);
      setLikes((prev) => Math.max(0, prev + likeDelta));

      // Make the API call
      const result = await toggleLike(candidateId);

      // Confirm state based on server response
      const serverIsLiked = result.action === "liked";

      // If server result doesn't match our optimistic update, fix it
      if (serverIsLiked !== newIsLiked) {
        setIsLiked(serverIsLiked);
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
      setIsLiked(!isLiked);
      setLikes((prev) => Math.max(0, prev + (isLiked ? 1 : -1)));

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
    <Button
      variant="ghost"
      size="sm"
      className="gap-1"
      onClick={handleLike}
      disabled={isLoading}
    >
      <div
        className={`h-4 w-4 border-2 rounded-full border-black ${
          isLiked ? "bg-black text-white" : ""
        }`}
      />
      <span>{likes}</span>
    </Button>
  );
}
