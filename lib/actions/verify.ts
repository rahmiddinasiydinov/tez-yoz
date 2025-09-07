'use server'

const API = process.env.NEXT_PUBLIC_API;

if (!API) {
  throw new Error('API is not found in env');
}

export async function verify(email: string, code: string) {
  if (!email || !code) {
    throw new Error('Email and code are required');
  }

  const base = API!.replace(/\/$/, '');
  const res = await fetch(`${base}/auth/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, code }),
    cache: 'no-store',
  });

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message = isJson
      ? (data?.message || data?.error || 'Verification failed')
      : (typeof data === 'string' ? data : 'Verification failed');
    throw new Error(message);
  }

  return data;
}