"use server";

import type { LoginResponse } from "@/lib/types/auth";
import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API;


export async function loginAction(email: string, password: string) {
  if (!API) {
    return { success: false, message: "API is not found in env", statusCode: 500 };
  }
  const cookieStore = await cookies();
  if (!email || !password) {
    return { success: false, message: "Email and password are required", statusCode: 400 };
  }
  const base = API;
  const res = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data: LoginResponse = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    const message = isJson
      ? data?.message || "Login failed"
      : typeof data === "string"
      ? data
      : "Login failed";
    return  { success: false, error: message as string, statucCode: data?.statusCode};
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
    return { success: true, token: data.data.accessToken };
  } else {
    return { success: false, status: 401, message: "Unauthorized!" };
  }
}
