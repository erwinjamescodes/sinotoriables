import Image from "next/image";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getCandidateById, getUserLikes } from "@/app/actions";
import { LikeButton } from "@/components/like-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RelatedCandidates } from "@/components/related-candidates";
import {
  CalendarIcon,
  BookIcon,
  BriefcaseIcon,
  AwardIcon,
  UserIcon,
  UsersIcon,
  ExternalLinkIcon,
  ArrowLeftIcon,
} from "lucide-react";
import Link from "next/link";

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
    console.log(candidate);

    // Fetch like status for this candidate
    const { likedCandidates } = await getUserLikes([candidate.id]);
    const isLiked = likedCandidates.includes(candidate.id);

    // Format date to be more readable
    const birthdate = new Date(candidate.birthdate).toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );

    // Format bio text to preserve paragraphs
    const formattedBio = candidate.bio
      ? candidate.bio.split("\n").map((paragraph: string, index: number) => (
          <p key={index} className="mb-4 last:mb-0">
            {paragraph}
          </p>
        ))
      : "No biography available.";

    return (
      <div className="container px-4 py-4 md:py-8 max-w-full md:max-w-screen-xl mx-auto">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Photo */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <div className="aspect-[3/4] relative">
                  <Image
                    src={candidate.photo_url}
                    alt={candidate.name}
                    fill
                    className="object-cover rounded-lg"
                    priority
                  />
                </div>
              </CardContent>
            </Card>

            {/* Votes count card */}
            <Card className="mt-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Current votes:
                  </span>
                  <span className="font-bold text-lg">
                    {candidate.like_count}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2">
            <div className="flex flex-col md:flex-row justify-between items-start">
              <div className="flex-1">
                {candidate.profile_url ? (
                  <Link
                    href={candidate.profile_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center group"
                  >
                    <h1 className="text-3xl font-bold break-words group-hover:text-gray-600 transition-colors">
                      {candidate.name}
                    </h1>
                    <ExternalLinkIcon className="h-5 w-5 ml-2 text-gray-500 group-hover:text-gray-600 transition-colors" />
                  </Link>
                ) : (
                  <h1 className="text-3xl font-bold break-words">
                    {candidate.name}
                  </h1>
                )}
                <p className="text-xl text-muted-foreground uppercase mb-2">
                  {candidate.party}
                </p>
                {candidate.alliance && (
                  <p className="text-sm text-muted-foreground">
                    Alliance: {candidate.alliance}
                  </p>
                )}
                {candidate.alias && (
                  <p className="text-sm text-muted-foreground">
                    Known as: "{candidate.alias}"
                  </p>
                )}
              </div>
              <div className="">
                <Link
                  href={candidate.profile_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ArrowLeftIcon className="h-5 w-5 ml-2  text-gray-600 hover:text-gray-800 transition-colors" />
                  <p className=" font-bold  text-gray-600 hover:text-gray-800 transition-colors">
                    Back to Candidates
                  </p>
                </Link>
              </div>
            </div>

            {/* Tabs for different sections of information */}
            <div className="mt-6 overflow-x-hidden">
              <Tabs defaultValue="bio">
                <TabsList className="w-full flex">
                  <TabsTrigger value="bio" className="flex-1">
                    Biography
                  </TabsTrigger>
                  <TabsTrigger value="details" className="flex-1">
                    Personal Details
                  </TabsTrigger>
                  <TabsTrigger value="qualifications" className="flex-1">
                    Qualifications
                  </TabsTrigger>
                </TabsList>

                {/* Biography Tab */}
                <TabsContent value="bio" className="mt-4">
                  <Card>
                    <CardContent className="p-4 md:p-6">
                      {/* <h2 className="text-xl font-semibold mb-4">Biography</h2> */}
                      <div className="text-gray-700 break-words">
                        {formattedBio}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Personal Details Tab */}
                <TabsContent value="details" className="mt-4">
                  <Card>
                    <CardContent className="p-4 md:p-6">
                      {/* <h2 className="text-xl font-semibold mb-4">
                        Personal Details
                      </h2> */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-2">
                          <UserIcon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm text-muted-foreground">
                              Full Name
                            </p>
                            <p className="font-medium break-words">
                              {candidate.full_name}
                            </p>
                          </div>
                        </div>

                        {candidate.birthdate && (
                          <div className="flex items-start gap-2">
                            <CalendarIcon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm text-muted-foreground">
                                Birth Date
                              </p>
                              <p className="font-medium">{birthdate}</p>
                            </div>
                          </div>
                        )}

                        {candidate.gender && (
                          <div className="flex items-start gap-2">
                            <UserIcon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm text-muted-foreground">
                                Gender
                              </p>
                              <p className="font-medium">{candidate.gender}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Qualifications Tab */}
                <TabsContent value="qualifications" className="mt-4">
                  <Card>
                    <CardContent className="p-4 md:p-6">
                      {/* <h2 className="text-xl font-semibold mb-4">
                        Qualifications & Experience
                      </h2> */}
                      <div className="space-y-6">
                        {candidate.education && (
                          <div className="flex items-start gap-2">
                            <BookIcon className="w-5 h-5 text-muted-foreground  flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm text-muted-foreground">
                                Education
                              </p>
                              <p className="font-medium break-words">
                                {candidate.education}
                              </p>
                            </div>
                          </div>
                        )}

                        {candidate.profession && (
                          <div className="flex items-start gap-2">
                            <BriefcaseIcon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm text-muted-foreground">
                                Profession
                              </p>
                              <p className="font-medium break-words">
                                {candidate.profession}
                              </p>
                            </div>
                          </div>
                        )}

                        {candidate.prior_experience && (
                          <div className="flex items-start gap-2">
                            <AwardIcon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm text-muted-foreground">
                                Prior Experience
                              </p>
                              <p className="font-medium break-words">
                                {candidate.prior_experience}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Related Candidates Section */}
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
