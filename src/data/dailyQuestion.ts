
"use client";

import type { DailyQuestion } from '@/types/daily-question';

export async function getDailyQuestion(): Promise<DailyQuestion | null> {
  try {
    const response = await fetch('/api/daily-question');
    if (!response.ok) {
      throw new Error(`Failed to fetch from /api/daily-question: ${response.statusText}`);
    }
    const data = await response.json();
    // Assuming the API returns an array of questions and we take the first one.
    if (Array.isArray(data) && data.length > 0) {
      return data[0] as DailyQuestion;
    }
    return null;
  } catch (error) {
    console.error("Error fetching daily question from client-side proxy:", error);
    return null;
  }
}
