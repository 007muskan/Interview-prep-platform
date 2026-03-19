# Free LLM Setup Guide

This project supports multiple FREE AI providers! No need for paid OpenAI API.

## Recommended: Google Gemini (FREE)

### Why Gemini?
- ✅ Completely FREE
- ✅ 60 requests per minute
- ✅ High quality responses
- ✅ Easy to set up

### Setup Steps:

1. **Get API Key:**
   - Go to: https://makersuite.google.com/app/apikey
   - Click "Create API Key"
   - Copy the key

2. **Update .env:**
   ```env
   LLM_PROVIDER="gemini"
   GEMINI_API_KEY="your-api-key-here"
   ```

3. **Done!** Start using the app

## Alternative: Groq (FREE & FAST)

### Why Groq?
- ✅ Completely FREE
- ✅ VERY fast responses
- ✅ Generous rate limits
- ✅ Uses Llama 3.1 70B model

### Setup Steps:

1. **Get API Key:**
   - Go to: https://console.groq.com
   - Sign up/Login
   - Go to API Keys section
   - Create new key

2. **Update .env:**
   ```env
   LLM_PROVIDER="groq"
   GROQ_API_KEY="your-groq-api-key-here"
   ```

3. **Done!** Start using the app

## Comparison

| Provider | Cost | Speed | Quality | Rate Limit |
|----------|------|-------|---------|------------|
| Gemini   | FREE | Fast  | High    | 60/min     |
| Groq     | FREE | Very Fast | High | Very High |
| OpenAI   | PAID | Fast  | Very High | Depends on plan |

## Which Should I Choose?

- **For most users**: Use **Gemini** (easiest setup, great quality)
- **For speed**: Use **Groq** (fastest responses)
- **For best quality**: Use **OpenAI** (but costs money)

## Testing Your Setup

After setting up, test with:

```bash
npm run dev
```

Then:
1. Sign up/Login
2. Upload a resume
3. Try interview prep
4. Generate a roadmap

All AI features will work with your chosen FREE provider!

## Troubleshooting

### "API Key not set" error
- Make sure you set `LLM_PROVIDER` in .env
- Make sure the corresponding API key is set
- Restart your dev server after changing .env

### Rate limit errors
- Gemini: Wait a minute, you hit 60 requests/min
- Groq: Very rare, limits are high
- Solution: Add a small delay between requests

### JSON parsing errors
- This is rare but can happen
- The app has fallback responses
- Try again, it usually works the second time

## Cost Comparison

**Using Gemini/Groq (FREE):**
- Resume analysis: $0
- Interview questions: $0
- Roadmap generation: $0
- **Total: $0/month** 🎉

**Using OpenAI (PAID):**
- Resume analysis: ~$0.05 each
- Interview questions: ~$0.02 each
- Roadmap generation: ~$0.10 each
- **Total: ~$50-100/month** 💸

## Need Help?

- Check the main README.md
- Open an issue on GitHub
- Make sure your API keys are correct
