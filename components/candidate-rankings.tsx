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
import { Search } from "lucide-react";
import type { CandidateWithLikes } from "@/lib/supabase";

interface CandidateRankingsProps {
  candidates: CandidateWithLikes[];
}

export function CandidateRankings({ candidates }: CandidateRankingsProps) {
  const [searchQuery, setSearchQuery] = useState("");

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
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-md border-none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Rank</TableHead>
              <TableHead>Candidate</TableHead>
              <TableHead>Party</TableHead>
              <TableHead className="text-right">Likes</TableHead>
              <TableHead className="w-[100px]"></TableHead>
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
                  <TableRow key={candidate.id}>
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
                    <TableCell>{candidate.party}</TableCell>
                    <TableCell className="text-right">
                      {candidate.like_count}
                    </TableCell>
                    <TableCell>
                      <Link href={`/candidates/${candidate.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
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
