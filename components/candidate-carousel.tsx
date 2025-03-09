import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { LikeButton } from "@/components/like-button"

export async function CandidateCarousel() {
  // Fetch top 5 candidates by likes
  const { data: candidates, error } = await supabase
    .from("candidates_with_likes")
    .select("*")
    .order("like_count", { ascending: false })
    .limit(5)

  if (error) {
    console.error("Error fetching candidates:", error)
    return <div>Failed to load candidates</div>
  }

  return (
    <div className="relative">
      <div className="flex space-x-4 pb-4 overflow-x-auto">
        {candidates.map((candidate) => (
          <Card key={candidate.id} className="min-w-[250px] max-w-[250px]">
            <CardContent className="p-4">
              <div className="aspect-square relative mb-3 overflow-hidden rounded-lg">
                <Image
                  src={candidate.image_url || `/placeholder.svg?height=300&width=300`}
                  alt={candidate.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium leading-none">{candidate.name}</h3>
                <p className="text-sm text-muted-foreground">{candidate.party}</p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <Link href={`/candidates/${candidate.id}`} className="text-sm text-primary hover:underline">
                  View Profile
                </Link>
                <LikeButton candidateId={candidate.id} initialLikes={candidate.like_count} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
