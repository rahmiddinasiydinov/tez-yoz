import type { LeaderboardResponse } from "@/lib/leaderboard";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");
  
  if (token) {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API + "/api/attempt",
      {
        headers: {
          "Authorization": `Bearer ${token.value}`,
        },
      }
    );

    const data: LeaderboardResponse = await res.json();
    
    return NextResponse.json(data);
  } else {
    return NextResponse.json(null);
  }
}
