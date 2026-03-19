# OAuth CSP (Content Security Policy) Troubleshooting

## The Problem
You're seeing CSP errors when trying to use Google OAuth because the browser is blocking external scripts required for OAuth authentication.

## What I've Fixed

### 1. Updated `next.config.js`
Added proper CSP headers that allow:
- Google OAuth scripts and styles
- GitHub OAuth integration  
- Supabase connections
- Required external resources

### 2. Updated `middleware.ts`
- Added exception for OAuth callback routes
- Ensures OAuth flows aren't interrupted by auth middleware

## Additional Steps to Try

### Option 1: Restart Development Server
After updating the Next.js config, restart your dev server:
```bash
npm run dev
# or
yarn dev
```

### Option 2: Clear Browser Cache
1. Open Developer Tools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### Option 3: Disable Browser Extensions Temporarily
Some ad blockers or privacy extensions can interfere with OAuth:
1. Try opening your app in an incognito/private window
2. Or temporarily disable extensions that might block tracking/ads

### Option 4: Alternative CSP Configuration
If the current CSP is too restrictive, you can try a more permissive version by updating `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https:",
              "style-src 'self' 'unsafe-inline' https:",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https:",
              "connect-src 'self' https: wss:",
              "frame-src 'self' https:",
              "form-action 'self' https:",
              "base-uri 'self'",
              "object-src 'none'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}
```

### Option 5: Disable CSP Temporarily for Testing
To test if CSP is the issue, you can temporarily disable it:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Comment out the headers function to disable CSP
  // async headers() { ... }
}
```

## Testing OAuth After Fixes

1. **Restart your development server**
2. **Clear browser cache**
3. **Navigate to `/auth`**
4. **Click Google or GitHub OAuth buttons**
5. **Check browser console for errors**

## Expected Behavior

After applying these fixes:
- ✅ No CSP errors in browser console
- ✅ OAuth popup/redirect works smoothly
- ✅ Successful authentication redirects to dashboard
- ✅ User data syncs to your database

## Still Having Issues?

If you're still seeing CSP errors:

1. **Check the exact error message** - it will tell you which resource is being blocked
2. **Add the blocked domain** to the appropriate CSP directive in `next.config.js`
3. **Verify Supabase OAuth configuration** - ensure redirect URLs are correct
4. **Test in different browsers** - some browsers have stricter CSP enforcement

## Production Considerations

For production deployment:
- Keep CSP as restrictive as possible for security
- Only allow necessary domains
- Test OAuth thoroughly in production environment
- Monitor for CSP violations in production logs

The CSP configuration I've provided should resolve the OAuth issues while maintaining good security practices.