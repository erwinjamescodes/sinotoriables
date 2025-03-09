import Image from "next/image"
import { notFound } from "next/navigation"
import { getCandidateById } from "@/app/actions"
import { LikeButton } from "@/components/like-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RelatedCandidates } from "@/components/related-candidates"

interface CandidatePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: CandidatePageProps) {
  const id = Number.parseInt(params.id)
  if (isNaN(id)) return { title: "Candidate Not Found" }

  try {
    const candidate = await getCandidateById(id)
    return {
      title: `${candidate.name} | PhilSenate Pulse`,
      description: `Learn about ${candidate.name}, candidate for the Philippine Senate.`,
    }
  } catch (error) {
    return { title: "Candidate Not Found" }
  }
}

export default async function CandidatePage({ params }: CandidatePageProps) {
  const id = Number.parseInt(params.id)
  if (isNaN(id)) notFound()

  try {
    const candidate = await getCandidateById(id)

    return (
      <div className="container py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <div className="aspect-[3/4] relative">
                  <Image
                    src={candidate.image_url || `/placeholder.svg?height=600&width=400`}
                    alt={candidate.name}
                    fill
                    className="object-cover rounded-t-lg"
                    priority
                  />
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold">{candidate.name}</h1>
                    <p className="text-muted-foreground">{candidate.party}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Likes:</span>
                      <span className="font-medium">{candidate.likes_count}</span>
                    </div>
                    <LikeButton candidateId={candidate.id} initialLikes={candidate.likes_count} />
                  </div>
                  <div className="pt-4 border-t">
                    <Button className="w-full">Share Profile</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="bio" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="bio">Biography</TabsTrigger>
                <TabsTrigger value="platform">Platform</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
              </TabsList>
              <TabsContent value="bio" className="p-4 border rounded-md mt-2">
                <h2 className="text-xl font-semibold mb-4">Biography</h2>
                <div className="prose max-w-none dark:prose-invert">
                  <p>{candidate.bio}</p>
                </div>
              </TabsContent>
              <TabsContent value="platform" className="p-4 border rounded-md mt-2">
                <h2 className="text-xl font-semibold mb-4">Platform</h2>
                <div className="prose max-w-none dark:prose-invert">
                  <p>{candidate.platform}</p>
                </div>
              </TabsContent>
              <TabsContent value="stats" className="p-4 border rounded-md mt-2">
                <h2 className="text-xl font-semibold mb-4">Statistics</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-md">
                    <div className="text-sm text-muted-foreground">Likes</div>
                    <div className="text-2xl font-bold">{candidate.likes_count}</div>
                  </div>
                  <div className="p-4 border rounded-md">
                    <div className="text-sm text-muted-foreground">Ranking</div>
                    <div className="text-2xl font-bold">#3</div>
                  </div>
                  <div className="p-4 border rounded-md">
                    <div className="text-sm text-muted-foreground">Party Rank</div>
                    <div className="text-2xl font-bold">#1</div>
                  </div>
                  <div className="p-4 border rounded-md">
                    <div className="text-sm text-muted-foreground">Trending</div>
                    <div className="text-2xl font-bold">+5%</div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Related Candidates</h2>
              <RelatedCandidates currentCandidateId={candidate.id} />
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    notFound()
  }
}

