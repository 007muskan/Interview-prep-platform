// Quick test to verify LLM client works
require('dotenv').config()

async function testLLM() {
  try {
    console.log('Testing LLM connection...')
    console.log('LLM_PROVIDER:', process.env.LLM_PROVIDER)
    console.log('GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY)
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a helpful assistant. Return valid JSON." },
          { role: "user", content: 'Return this JSON: {"test": "success", "score": 85}' },
        ],
        temperature: 0.7,
        max_tokens: 100,
        response_format: { type: "json_object" },
      }),
    })

    console.log('Response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error response:', errorText)
      return
    }

    const data = await response.json()
    console.log('Success! Response:', JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Test failed:', error)
  }
}

testLLM()
