'use server'

import {RegisterResponse} from "@/lib/types/auth";

const API = process.env.NEXT_PUBLIC_API

if(!API){
throw new Error('API is not found in env')
}

export async function registerAction(username:string, email: string, password: string){
  if (!username || !email || !password) {
    throw new Error('Username, email and password are required');
  }
  const base = API
  const res = await fetch(`${base}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
    cache: 'no-store',
  });

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data: RegisterResponse = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    const message = isJson
      ? (data?.statusCode || 'Registration failed')
      : (typeof data === 'string' ? data : 'Registration failed');
    throw new Error(message as string);
  }

  return data;
} 
