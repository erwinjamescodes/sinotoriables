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
    <div className="flex flex-col gap-4 md:flex-row md:items-end">
      <div className="flex-1 space-y-1">
        <label htmlFor="search" className="text-sm font-medium">
          Search
        </label>
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

      {/* <div className="w-full md:w-[180px] space-y-1">
        <label htmlFor="party" className="text-sm font-medium">
          Party
        </label>
        <Select value={partyFilter} onValueChange={setPartyFilter}>
          <SelectTrigger id="party">
            <SelectValue placeholder="All Parties" />
          </SelectTrigger>
          <SelectContent>
            {parties.map((party) => (
              <SelectItem key={party.value} value={party.value}>
                {party.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}

      <div className="w-full md:w-[300px] space-y-1">
        <label htmlFor="sort" className="text-sm font-medium">
          Sort By
        </label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger id="sort">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button className="md:self-end">Apply Filters</Button>
    </div>
  );
}
