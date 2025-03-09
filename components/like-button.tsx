"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toggleLike } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"

interface LikeButtonProps {
  candidateId: number
  initialLikes: number
}

export function LikeButton({ candidateId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleLike = async () => {
    setIsLoading(true)
    try {
      const result = await toggleLike(candidateId)

      if (result.liked) {
        setLikes((prev) => prev + 1)
        setIsLiked(true)
        toast({
          title: "Liked!",
          description: "You've successfully liked this candidate.",
        })
      } else {
        setLikes((prev) => prev - 1)
        setIsLiked(false)
        toast({
          title: "Like removed",
          description: "You've removed your like from this candidate.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error processing your like.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="ghost" size="sm" className="gap-1" onClick={handleLike} disabled={isLoading}>
      <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
      <span>{likes}</span>
    </Button>
  )
}

