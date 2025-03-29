import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CandidateCarousel } from "@/components/candidate-carousel";
import { StatsSection } from "@/components/stats-section";
import BallotAnimation from "@/components/ballot-animation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CalendarIcon,
  CheckCircleIcon,
  InfoIcon,
  MapPinIcon,
  NewspaperIcon,
} from "lucide-react";

export default async function Home() {
  return (
    <div className="flex flex-col pb-8 w-full">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white flex justify-center">
        <div className="container px-4 md:px-0">
          <div className="grid lg:grid-cols-2 items-center">
            <div className="flex flex-col justify-center gap-8 mb-8">
              <div className="space-y-6">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-3xl xl:text-6xl pr-8 md:pr-0">
                  Kilalanin at kilatisin kung sinu-sino ang mga tumatakbo sa
                  pagka-Senador ngayong 2025
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Stay informed about the upcoming Senate elections. Explore
                  candidates, their platforms, and show your support.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row ">
                <Link href="/candidates">
                  <Button size="lg">View Candidates</Button>
                </Link>
                <Link href="/statistics">
                  <Button size="lg" variant="outline">
                    Explore Statistics
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <BallotAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container px-4 md:px-6 py-8 bg-muted rounded-lg mx-auto mb-12">
        <StatsSection />
      </section>

      {/* Featured Candidates */}
      <section className="container mx-auto mt-8 px-4 md:px-0">
        <div className="flex flex-col gap-4 mb-2">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Featured Candidates
            </h2>
            <p className="text-muted-foreground">
              Explore the top candidates in the upcoming Senate elections.
            </p>
          </div>
          <CandidateCarousel />
        </div>
        <div className="flex justify-center mt-2">
          <Link href="/candidates">
            <Button variant="outline" size="lg">
              View Candidates
            </Button>
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container px-4 md:px-0 mx-auto mt-16 mb-8 bg-blue-50 py-12 rounded-lg">
        <div className="flex flex-col items-center gap-4 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">
            Your Voice Matters
          </h2>
          <p className="text-muted-foreground max-w-[700px] text-lg">
            Democracy works best when citizens are informed and engaged. Explore
            candidate profiles, learn about their platforms, and show your
            support by liking your preferred candidates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link href="/candidates">
              <Button size="lg" className="px-8">
                View Candidates
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
