import Link from "next/link"
import Image from "next/image"
import { cache } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"

interface RelatedCandidatesProps {
  currentCandidateId: number
}

// Cache the candidate party lookup to reduce duplicate API calls
const getCandidateParty = cache(async (candidateId: number) => {
  const { data, error } = await supabase
    .from("candidates")
    .select("party")
    .eq("id", candidateId)
    .single()
  
  if (error) {
    console.error("Error fetching candidate party:", error)
    return null
  }
  
  return data
})

// Cache the related candidates lookup
const getRelatedCandidates = cache(async (candidateId: number, party: string) => {
  const { data, error } = await supabase
    .from("candidates_with_likes")
    .select("*")
    .eq("party", party)
    .neq("id", candidateId)
    .limit(3)
  
  if (error) {
    console.error("Error fetching related candidates:", error)
    return []
  }
  
  return data
})

export async function RelatedCandidates({ currentCandidateId }: RelatedCandidatesProps) {
  const currentCandidate = await getCandidateParty(currentCandidateId)

  if (!currentCandidate) {
    return null
  }

  const relatedCandidates = await getRelatedCandidates(currentCandidateId, currentCandidate.party)

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
                src={candidate.photo_url || `/placeholder.svg?height=48&width=48`}
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
