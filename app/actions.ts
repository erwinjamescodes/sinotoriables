"use server";

import { cookies } from "next/headers";
import { cache } from "react";
import { supabase } from "@/lib/supabase";

export async function toggleLike(candidateId: number) {
  const cookieStore = await cookies();
  let userId = cookieStore.get("user_id")?.value;

  if (!userId) {
    // Generate a random ID if none exists
    userId = Math.random().toString(36).substring(2, 15);
    cookieStore.set("user_id", userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });
  }

  // Call the toggle_like function in Supabase
  const { data, error } = await supabase.rpc("toggle_like", {
    p_candidate_id: candidateId,
    p_ip_address: userId,
  });

  if (error) {
    console.error("Error toggling like:", error);
    throw new Error("Failed to toggle like");
  }

  console.log("Toggle like response:", data); // Debug log to check response structure

  // Return a structured response based on the action from the Supabase function
  return {
    liked: data.action === "liked",
    action: data.action,
    candidateId: data.candidate_id,
  };
}

/**
 * Check if the current user has liked specific candidates
 * @param candidateIds Array of candidate IDs to check
 * @returns Object mapping candidate IDs to boolean liked status
 */
export const getUserLikes = cache(async (candidateIds?: number[]) => {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  // If no user ID is found, no likes exist yet
  if (!userId) {
    return { likedCandidates: [] };
  }

  let query = supabase
    .from("likes")
    .select("candidate_id")
    .eq("browser_id", userId);

  // Optionally filter by specific candidate IDs if provided
  if (candidateIds && candidateIds.length > 0) {
    query = query.in("candidate_id", candidateIds);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching user likes:", error);
    return { likedCandidates: [] };
  }

  // Return an array of liked candidate IDs
  return {
    likedCandidates: data.map((like) => like.candidate_id),
  };
});

export const getCandidates = cache(async () => {
  const { data, error } = await supabase
    .from("candidates_with_likes")
    .select("*")
    .order("id");

  if (error) {
    console.error("Error fetching candidates:", error);
    throw new Error("Failed to fetch candidates");
  }

  return data;
});

export const getCandidateById = cache(async (id: number) => {
  const { data, error } = await supabase
    .from("candidates_with_likes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching candidate:", error);
    throw new Error("Failed to fetch candidate");
  }

  return data;
});

export const getAnalyticsData = cache(async () => {
  // Get candidates with likes for analytics
  const { data: candidatesWithLikes, error } = await supabase
    .from("candidates_with_likes")
    .select("*")
    .order("like_count", { ascending: false });

  if (error) {
    console.error("Error fetching analytics data:", error);
    throw new Error("Failed to fetch analytics data");
  }

  // Get likes per day for the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: likesTimeline, error: timelineError } = await supabase
    .from("likes")
    .select("created_at")
    .gte("created_at", thirtyDaysAgo.toISOString());

  if (timelineError) {
    console.error("Error fetching likes timeline:", timelineError);
    throw new Error("Failed to fetch likes timeline");
  }

  // Process timeline data
  const timelineData = processTimelineData(likesTimeline);

  return {
    candidatesWithLikes,
    timelineData,
  };
});

function processTimelineData(likes: { created_at: string }[]) {
  const dateMap = new Map<string, number>();

  // Initialize the last 30 days with 0 likes
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split("T")[0];
    dateMap.set(dateString, 0);
  }

  // Count likes per day
  likes.forEach((like) => {
    const dateString = like.created_at.split("T")[0];
    if (dateMap.has(dateString)) {
      dateMap.set(dateString, (dateMap.get(dateString) || 0) + 1);
    }
  });

  // Convert to array and sort by date
  return Array.from(dateMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
