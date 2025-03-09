import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"

interface RelatedCandidatesProps {
  currentCandidateId: number
}

export async function RelatedCandidates({ currentCandidateId }: RelatedCandidatesProps) {
  // Fetch candidates from the same party
  const { data: currentCandidate } = await supabase
    .from("candidates")
    .select("party")
    .eq("id", currentCandidateId)
    .single()

  if (!currentCandidate) {
    return null
  }

  const { data: relatedCandidates } = await supabase
    .from("candidates_with_likes")
    .select("*")
    .eq("party", currentCandidate.party)
    .neq("id", currentCandidateId)
    .limit(3)

  if (!relatedCandidates || relatedCandidates.length === 0) {
    return <p className="text-muted-foreground">No related candidates found.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {relatedCandidates.map((candidate) => (
        <Card key={candidate.id}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={candidate.image_url || `/placeholder.svg?height=48&width=48`}
                alt={candidate.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium">{candidate.name}</h3>
              <Link href={`/candidates/${candidate.id}`} className="text-sm text-primary hover:underline">
                View Profile
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

