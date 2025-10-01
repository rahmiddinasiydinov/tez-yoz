"use server";

import { GET } from "@/app/api/game-mode/route";
import { cookies } from "next/headers";
import { GameModeResponse } from "../game-mode";
import { TestResult } from "../typing-engine";

// Define the response interface (adjust based on your backend response)
interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
  status?: number;
}

export async function saveTesResult(data: TestResult): Promise<ApiResponse> {
  try {
    if (!data.wpm || !data.accuracy || data.timeElapsed <= 0) {
      return {
        success: false,
        error: "Invalid test data provided",
      };
    }
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token");
    if (!token) {
      return { success: false, message: "There is no token.", status: 401 };
    }

    const res = await fetch(process.env.NEXT_PUBLIC_API + "/api/gamemode", {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    const gameMode: GameModeResponse = await res.json();
    const backendTestType = data.testType === "time" ? "BY_TIME" : "BY_WORD";
    if (gameMode.data) {
      const modes = gameMode.data.gameModes;
      const foundMode = modes.find(
        (mode) =>
          (mode.type === backendTestType && mode.value) || data.testValue
      );

      if (foundMode?.id) {

        const response = await fetch(
          process.env.NEXT_PUBLIC_API + "/api/attempt",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token.value}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              language: data.language.toUpperCase(),
              gameModeId: foundMode.id,
              wpm: data.wpm,
              accuracy: data.accuracy,
              errors: data.errors,
              correctChars: data.correctChars,
              totalChars: data.totalChars,
              timeElapsed: data.timeElapsed,
              userId: data.userId,
            }),
          }
        );

        if (!response.ok) {
          const data = await response.json();

          return { success: false, message: "Could not send results" };
        }
        const resData = await response.json();

        return { success: true, message: "Result is successfully saved!" };
      } else {
        return { success: false, message: "Test mode is not found" };
      }
    } else {
      return { success: false, message: "Error in fetching game mode data!" };
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Sorry, we could not save result.",
    };
  }
}
