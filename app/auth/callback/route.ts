import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Sync user to our database
      await fetch(`${requestUrl.origin}/api/auth/sync-user`, {
        method: 'POST',
        headers: {
          'Cookie': request.headers.get('Cookie') || '',
        },
      })
    }
  }

  return NextResponse.redirect(new URL('/dashboard', request.url))
}
