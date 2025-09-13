import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");

  if (token) {
    cookieStore.delete("access_token");
    return NextResponse.json(
      { message: "Successfully logged out ", success: true },
      { status: 201 }
    );
  } else {
    return NextResponse.json({message: 'There was no token.'}, {status: 400});
  }
}
