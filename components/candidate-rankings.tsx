"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import type { CandidateWithLikes } from "@/lib/supabase";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";

interface CandidateRankingsProps {
  candidates: CandidateWithLikes[];
}

export function CandidateRankings({ candidates }: CandidateRankingsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const router = useRouter();

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.party.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search candidates..."
          className="pl-8 pr-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground focus:outline-none"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="rounded-md border-none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Rank</TableHead>
              <TableHead>Candidate</TableHead>
              {!isMobile && <TableHead>Party</TableHead>}
              <TableHead className="text-right">Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCandidates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No candidates found
                </TableCell>
              </TableRow>
            ) : (
              filteredCandidates
                .sort((a, b) => b.like_count - a.like_count)
                .map((candidate, index) => (
                  <TableRow
                    key={candidate.id}
                    className="cursor-pointer"
                    onClick={() => {
                      router.push(`/candidates/${candidate.id}`);
                    }}
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden">
                          <Image
                            src={
                              candidate.photo_url ||
                              `/placeholder.svg?height=32&width=32`
                            }
                            alt={candidate.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span>{candidate.name}</span>
                      </div>
                    </TableCell>
                    {!isMobile && <TableCell>{candidate.party}</TableCell>}
                    <TableCell className="text-right">
                      {candidate.like_count}
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
