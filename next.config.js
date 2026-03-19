/** @type {import('next').NextConfig} */
const nextConfig = {
  // Temporarily disable CSP to test OAuth functionality
  // The CSP errors are likely from browser extensions, not our app
  
  // Uncomment the headers function below after confirming OAuth works without CSP
  /*
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com https://apis.google.com https://www.google.com https://ssl.gstatic.com",
              "script-src-elem 'self' 'unsafe-inline' https://accounts.google.com https://apis.google.com https://www.google.com https://ssl.gstatic.com",
              "style-src 'self' 'unsafe-inline' https://accounts.google.com https://fonts.googleapis.com",
              "style-src-elem 'self' 'unsafe-inline' https://accounts.google.com https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https: https://fonts.gstatic.com",
              "connect-src 'self' https://*.supabase.co https://accounts.google.com https://www.google.com wss://*.supabase.co",
              "frame-src 'self' https://accounts.google.com https://www.google.com",
              "frame-ancestors 'self' https://accounts.google.com",
              "form-action 'self' https://accounts.google.com",
              "base-uri 'self'",
              "object-src 'none'",
            ].join('; '),
          },
        ],
      },
    ]
  },
  */
}

module.exports = nextConfig
