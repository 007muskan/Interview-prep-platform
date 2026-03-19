# Google OAuth Setup Guide

This guide will help you set up Google authentication for your application.

## Prerequisites

- Supabase project set up and running
- Your app deployed or running locally

## 1. Configure Google OAuth in Supabase

### Step 1: Access Supabase Dashboard
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Authentication** > **Providers**

### Step 2: Enable Google OAuth
1. Find **Google** in the list and click to configure
2. Toggle **Enable sign in with Google** to ON

## 2. Set Up Google OAuth

### Step 1: Create Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API** (if not already enabled)
4. Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client ID**
5. Configure the consent screen if prompted
6. Choose **Web application** as the application type
7. Add these **Authorized redirect URIs**:
   ```
   https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback
   http://localhost:54321/auth/v1/callback (for local development)
   ```
8. Copy the **Client ID** and **Client Secret**

### Step 2: Configure Google in Supabase
1. In Supabase Dashboard > Authentication > Providers > Google
2. Paste your **Client ID** and **Client Secret**
3. Click **Save**

## 3. Update Environment Variables (Optional)

If you want to store OAuth credentials in your environment (not required for Supabase Auth):

```bash
# Add to your .env file
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## 4. Test Google Authentication

1. Start your development server: `npm run dev`
2. Navigate to `/auth`
3. Click on **Continue with Google** button
4. Complete the OAuth flow
5. You should be redirected to `/dashboard` upon successful authentication

## 5. Production Setup

For production deployment:

1. Update the **Authorized redirect URIs** in Google Console:
   ```
   https://your-production-domain.com/auth/callback
   https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback
   ```

2. Update your `NEXT_PUBLIC_APP_URL` in production environment

## Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch" error**
   - Ensure the redirect URI in your OAuth app matches exactly what Supabase expects
   - Check for trailing slashes and protocol (http vs https)

2. **OAuth flow not working**
   - Verify that Google provider is enabled in Supabase
   - Check that Client ID and Secret are correctly configured
   - Ensure your app URL is correct

3. **User not syncing to database**
   - Check that the `/api/auth/sync-user` endpoint is working
   - Verify database permissions and schema

### Getting Your Supabase Project Reference:
Your Supabase project reference can be found in your Supabase URL:
`https://YOUR_PROJECT_REF.supabase.co`

For example, if your URL is `https://xsxgferpzkmmqsiapbzl.supabase.co`, then your project reference is `xsxgferpzkmmqsiapbzl`.

## Next Steps

After setting up Google OAuth:
1. Test Google authentication thoroughly
2. Verify user data is properly synced to your database
3. Consider adding additional OAuth providers if needed
4. Set up proper error handling for OAuth failures

Your Google OAuth authentication should now be fully functional!