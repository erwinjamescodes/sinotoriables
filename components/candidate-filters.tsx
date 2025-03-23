"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CandidateFilters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [partyFilter, setPartyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // In a real app, these would be fetched from the database
  // const parties = [
  //   { value: "all", label: "All Parties" },
  //   { value: "party1", label: "Party 1" },
  //   { value: "party2", label: "Party 2" },
  //   { value: "party3", label: "Party 3" },
  // ]

  const sortOptions = [
    { value: "name", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "likes", label: "Most Liked" },
    { value: "likes-asc", label: "Least Liked" },
  ];

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end flex-1">
      <div className="flex-1 space-y-1">
        {/* <label htmlFor="search" className="text-sm font-medium">
          Search
        </label> */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search candidates..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
