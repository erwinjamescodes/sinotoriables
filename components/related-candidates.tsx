import Link from "next/link";
import Image from "next/image";
import { cache } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";

interface RelatedCandidatesProps {
  currentCandidateId: number;
}

// Cache the candidate party lookup to reduce duplicate API calls
const getCandidateParty = cache(async (candidateId: number) => {
  const { data, error } = await supabase
    .from("candidates")
    .select("party")
    .eq("id", candidateId)
    .single();

  if (error) {
    console.error("Error fetching candidate party:", error);
    return null;
  }

  return data;
});

// Cache the related candidates lookup
const getRelatedCandidates = cache(
  async (candidateId: number, party: string) => {
    const { data, error } = await supabase
      .from("candidates_with_details")
      .select("*")
      .eq("party", party)
      .neq("id", candidateId)
      .limit(3);

    if (error) {
      console.error("Error fetching related candidates:", error);
      return [];
    }

    return data;
  }
);

export async function RelatedCandidates({
  currentCandidateId,
}: RelatedCandidatesProps) {
  const currentCandidate = await getCandidateParty(currentCandidateId);

  if (!currentCandidate) {
    return null;
  }

  const relatedCandidates = await getRelatedCandidates(
    currentCandidateId,
    currentCandidate.party
  );

  if (!relatedCandidates || relatedCandidates.length === 0) {
    return (
      <p className="text-muted-foreground">No related candidates found.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      {relatedCandidates.map((candidate) => (
        <Card key={candidate.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 md:p-4 flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={
                  candidate.photo_url || `/placeholder.svg?height=48&width=48`
                }
                alt={candidate.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-sm md:text-base truncate">{candidate.name}</h3>
              <Link
                href={`/candidates/${candidate.id}`}
                className="text-xs md:text-sm text-primary hover:underline inline-block"
              >
                View Profile
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
