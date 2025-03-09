import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { LikeButton } from "@/components/like-button"
import type { CandidateWithLikes } from "@/lib/supabase"

interface CandidateCardProps {
  candidate: CandidateWithLikes
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[3/4] relative">
        <Image
          src={candidate.image_url || `/placeholder.svg?height=400&width=300`}
          alt={candidate.name}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-4">
        <div className="space-y-1">
          <h3 className="font-medium text-lg">{candidate.name}</h3>
          <p className="text-sm text-muted-foreground">{candidate.party}</p>
        </div>
        <p className="mt-2 text-sm line-clamp-3">{candidate.bio}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Link href={`/candidates/${candidate.id}`} className="text-sm font-medium text-primary hover:underline">
          View Profile
        </Link>
        <LikeButton candidateId={candidate.id} initialLikes={candidate.likes_count} />
      </CardFooter>
    </Card>
  )
}

