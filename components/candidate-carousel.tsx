import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { LikeButton } from "@/components/like-button";

export async function CandidateCarousel() {
  // Fetch top 5 candidates by likes
  const { data: candidates, error } = await supabase
    .from("candidates_with_likes")
    .select("*")
    .order("like_count", { ascending: false })
    .limit(4);

  if (error) {
    console.error("Error fetching candidates:", error);
    return <div>Failed to load candidates</div>;
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-4">
        {candidates.map((candidate) => (
          <Card key={candidate.id} className="">
            <CardContent className="p-4">
              <div className="aspect-square relative mb-3 overflow-hidden rounded-lg">
                <Image
                  src={
                    candidate.photo_url ||
                    `/placeholder.svg?height=300&width=300`
                  }
                  alt={candidate.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium leading-none">{candidate.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {candidate.party}
                </p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <Link
                  href={`/candidates/${candidate.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  View Profile
                </Link>
                <LikeButton
                  candidateId={candidate.id}
                  initialLikes={candidate.like_count}
                  isLiked={candidate.liked}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
