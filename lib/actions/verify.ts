"use server";

import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API;

if (!API) {
  throw new Error("API is not found in env");
}

export async function verifyAction(email: string, code: string) {
  const cookieStore = await cookies();
  if (!email || !code) {
    throw new Error("Email and code are required");
  }

  const base = API!.replace(/\/$/, "");
  const res = await fetch(`${base}/api/auth/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, code }),
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message = isJson
      ? data?.message || data?.error || "Verification failed"
      : typeof data === "string"
      ? data
      : "Verification failed";
    throw new Error(message);
  }

  if (data.data?.accessToken) {
    cookieStore.set("access_token", data.data?.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    cookieStore.set("refresh_token", data.data?.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    return { success: true };
  } else {
    return { success: false, status: 401, message: "Unauthorized!" };
  }
}
