"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CandidateFilters({ onSearch }: { onSearch: (query: string) => void }) {
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

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    onSearch(newValue);
  };

  // Clear search query
  const clearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };

  return (
    <div className="w-full">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          id="search"
          placeholder="Search candidates..."
          className="pl-8 pr-8 w-full"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-gray-900 focus:outline-none transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
