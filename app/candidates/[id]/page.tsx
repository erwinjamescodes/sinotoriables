import Image from "next/image";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getCandidateById, getUserLikes } from "@/app/actions";
import { LikeButton } from "@/components/like-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RelatedCandidates } from "@/components/related-candidates";

interface CandidatePageProps {
  params: {
    id: string;
  };
}

// Create a cached version of getCandidateById to avoid duplicate requests
const getCachedCandidateById = cache(getCandidateById);

export async function generateMetadata({ params }: CandidatePageProps) {
  const id = Number.parseInt(params.id);
  if (isNaN(id)) return { title: "Candidate Not Found" };

  try {
    const candidate = await getCachedCandidateById(id);
    return {
      title: `${candidate.name} | SinoToriables PH`,
      description: `Learn about ${candidate.name}, candidate for the Philippine Senate.`,
    };
  } catch (error) {
    return { title: "Candidate Not Found" };
  }
}

export default async function CandidatePage({ params }: CandidatePageProps) {
  const id = Number.parseInt(params.id);
  if (isNaN(id)) notFound();

  try {
    const candidate = await getCachedCandidateById(id);

    // Fetch like status for this candidate
    const { likedCandidates } = await getUserLikes([candidate.id]);
    const isLiked = likedCandidates.includes(candidate.id);

    return (
      <div className="container p-4 md:py-8">
        <div className="grid gap-2 md:gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <div className="aspect-[3/4] relative">
                  <Image
                    src={
                      candidate.photo_url ||
                      `/placeholder.svg?height=600&width=400`
                    }
                    alt={candidate.name}
                    fill
                    className="object-cover rounded-lg"
                    priority
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <div className="pt-0 md:pt-4 flex flex-col md:flex-row justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">{candidate.name}</h1>
                <p className="text-muted-foreground uppercase">
                  {candidate.party}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Current votes count:
                </span>
                <span className="font-medium">{candidate.like_count}</span>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Related Candidates</h2>
              <RelatedCandidates currentCandidateId={candidate.id} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
