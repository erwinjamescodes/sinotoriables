import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CandidateCarousel } from "@/components/candidate-carousel";
import { StatsSection } from "@/components/stats-section";

export default async function Home() {
  return (
    <div className="flex flex-col gap-12 pb-8 w-full">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Track Philippine Senate Candidates
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Stay informed about the upcoming Senate elections. Explore
                  candidates, their platforms, and show your support.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/candidates">
                  <Button size="lg">View Candidates</Button>
                </Link>
                <Link href="/analytics">
                  <Button size="lg" variant="outline">
                    Explore Analytics
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[500px] aspect-square rounded-full bg-gradient-to-tr from-primary to-primary/20 flex items-center justify-center">
                <div className="absolute inset-4 rounded-full bg-background flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold">Senate Elections</h2>
                    <p className="text-muted-foreground">Coming Soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Candidates */}
      <section className="container px-4 md:px-6">
        <div className="flex flex-col gap-4">
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
      </section>

      {/* Stats Section */}
      <section className="container px-4 md:px-6 py-8 bg-muted rounded-lg">
        <StatsSection />
      </section>

      {/* Call to Action */}
      <section className="container px-4 md:px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to engage?
          </h2>
          <p className="text-muted-foreground max-w-[600px]">
            Explore candidate profiles, learn about their platforms, and show
            your support by liking your preferred candidates.
          </p>
          <Link href="/candidates">
            <Button size="lg" className="mt-4">
              View All Candidates
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
