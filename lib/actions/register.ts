'use server'

import {RegisterResponse} from "@/lib/types/auth";

const API = process.env.NODE_PUBLIC_API

if(!API){
throw new Error('API is not found in env')
}

export async function register(username:string, email: string, password: string){
  if (!username || !email || !password) {
    throw new Error('Username, email and password are required');
  }
  const base = API!.replace(/\/$/, '');
  const res = await fetch(`${base}/auth/register`, {
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
      ? (data?.message || 'Registration failed')
      : (typeof data === 'string' ? data : 'Registration failed');
    throw new Error(message);
  }

  return data;
} 
