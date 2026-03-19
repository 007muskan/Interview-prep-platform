// Unified LLM client that supports multiple providers

interface LLMResponse {
  content: string
}

interface LLMProvider {
  generateText(prompt: string, systemPrompt?: string): Promise<LLMResponse>
  generateJSON(prompt: string, systemPrompt?: string): Promise<any>
}

// Google Gemini Provider (FREE)
class GeminiProvider implements LLMProvider {
  private apiKey: string
  private model: string

  constructor(apiKey: string, model = "gemini-pro") {
    this.apiKey = apiKey
    this.model = model
  }

  async generateText(prompt: string, systemPrompt?: string): Promise<LLMResponse> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`
    
    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.candidates[0]?.content?.parts[0]?.text || ""

    return { content }
  }

  async generateJSON(prompt: string, systemPrompt?: string): Promise<any> {
    const response = await this.generateText(prompt, systemPrompt)
    try {
      // Extract JSON from markdown code blocks if present
      let jsonStr = response.content
      const jsonMatch = jsonStr.match(/```json\n([\s\S]*?)\n```/)
      if (jsonMatch) {
        jsonStr = jsonMatch[1]
      }
      return JSON.parse(jsonStr)
    } catch (error) {
      console.error("Failed to parse JSON:", response.content)
      throw new Error("Failed to parse JSON response")
    }
  }
}

// Groq Provider (FREE and FAST)
class GroqProvider implements LLMProvider {
  private apiKey: string
  private model: string

  constructor(apiKey: string, model = "llama-3.3-70b-versatile") {
    this.apiKey = apiKey
    this.model = model
  }

  async generateText(prompt: string, systemPrompt?: string): Promise<LLMResponse> {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || ""

    return { content }
  }

  async generateJSON(prompt: string, systemPrompt?: string): Promise<any> {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
          { role: "user", content: prompt },
        ],
        temperature: 0.5,
        max_tokens: 2048,
        response_format: { type: "json_object" },
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error("Groq API error response:", errorBody)
      throw new Error(`Groq API error: ${response.status} ${response.statusText} - ${errorBody}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || "{}"

    try {
      return JSON.parse(content)
    } catch (parseError) {
      console.error("Failed to parse Groq JSON response:", content)
      throw new Error("Failed to parse JSON response from Groq")
    }
  }
}

// Factory function to get the appropriate provider
export function getLLMProvider(): LLMProvider {
  const provider = process.env.LLM_PROVIDER || "gemini"

  try {
    switch (provider.toLowerCase()) {
      case "gemini":
        if (!process.env.GEMINI_API_KEY) {
          console.warn("GEMINI_API_KEY is not set, using fallback")
          throw new Error("GEMINI_API_KEY is not set")
        }
        return new GeminiProvider(process.env.GEMINI_API_KEY)

      case "groq":
        if (!process.env.GROQ_API_KEY) {
          console.warn("GROQ_API_KEY is not set, using fallback")
          throw new Error("GROQ_API_KEY is not set")
        }
        return new GroqProvider(process.env.GROQ_API_KEY)

      default:
        console.warn(`Unsupported LLM provider: ${provider}, using Groq as fallback`)
        if (process.env.GROQ_API_KEY) {
          return new GroqProvider(process.env.GROQ_API_KEY)
        }
        throw new Error(`Unsupported LLM provider: ${provider}`)
    }
  } catch (error) {
    console.error("LLM Provider initialization error:", error)
    throw error
  }
}

let llmInstance: LLMProvider | null = null

export function getLLM(): LLMProvider {
  if (!llmInstance) {
    llmInstance = getLLMProvider()
  }
  return llmInstance
}

// Export a lazy-loaded llm object
export const llm = {
  generateText: (prompt: string, systemPrompt?: string) => getLLM().generateText(prompt, systemPrompt),
  generateJSON: (prompt: string, systemPrompt?: string) => getLLM().generateJSON(prompt, systemPrompt),
}
