"use server";

import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API;


export async function verifyAction(email: string, code: string) {
  if (!API) {
    return { success: false, message: "API is not found in env", statusCode: 500 };
  }
  const cookieStore = await cookies();
  if (!email || !code) {
    return { success: false, message: "Email and code are required", statusCode: 400 };
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
      ? data?.statusCode || data?.error || "Verification failed"
      : typeof data === "string"
      ? data
      : "Verification failed";
    return { success: false, message: message as string, statusCode: data?.statusCode};
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
