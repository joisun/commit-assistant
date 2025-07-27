import { createOpenAI } from '@ai-sdk/openai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { streamText, generateObject } from 'ai'
import { z } from 'zod'
import { generateFormPrompt, generateTextPrompt } from './prompts'
import { Logger } from '../utils/logger'

interface Model {
  id: string
  name: string
}

interface OpenAIModel {
  id: string
  object: string
  created: number
  owned_by: string
}

interface ModelListResponse {
  object: string
  data: OpenAIModel[]
}

interface GeminiModel {
  name: string
  displayName: string
  description: string
}

interface GeminiModelListResponse {
  models: GeminiModel[]
}

interface ErrorResponse {
  error: {
    message: string
    type: string
    param: string | null
    code: string
  }
}

interface XAIErrorResponse {
  code: string
  error: string
}

const providerBaseUrls: Record<string, string> = {
  openai: 'https://api.openai.com/v1',
  openrouter: 'https://openrouter.ai/api/v1',
  xai: 'https://api.x.ai/v1',
}

export async function getAvailableModels(provider: string, apiKey: string, customBaseUrl?: string): Promise<Model[]> {
  if (provider === 'gemini') {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
      if (!response.ok) {
        const errorData: unknown = await response.json()
        // Handle different error structures
        let errorMessage = 'An unknown error occurred'
        if (typeof errorData === 'object' && errorData !== null && 'error' in errorData) {
          const errorPayload = errorData.error
          if (typeof errorPayload === 'object' && errorPayload !== null && 'message' in errorPayload && typeof (errorPayload as any).message === 'string') {
            errorMessage = (errorPayload as { message: string }).message
          } else if (typeof errorPayload === 'string') {
            errorMessage = errorPayload
          }
        }
        throw new Error(`Failed to fetch Gemini models: ${errorMessage}`)
      }
      const modelsData = (await response.json()) as GeminiModelListResponse
      return modelsData.models
        .map((model) => ({
          id: model.name,
          name: model.displayName,
        }))
        .sort((a, b) => a.name.localeCompare(b.name))
    } catch (error: any) {
      console.error('Error fetching Gemini models:', error)
      throw new Error(error.message || 'Failed to connect to Google AI.')
    }
  }

  try {
    const baseUrl = customBaseUrl || providerBaseUrls[provider]

    if (!baseUrl) {
      if (provider === 'custom') {
        throw new Error('A custom base URL is required for the "Custom" provider.')
      }
      throw new Error(`Unsupported provider without a default base URL: ${provider}`)
    }

    let client
    // We can expand this as we support more providers
    switch (provider) {
      case 'openai':
      case 'xai':
      case 'openrouter':
      case 'custom':
        client = createOpenAI({
          apiKey: apiKey,
          baseURL: baseUrl,
        })
        break
      case 'gemini':
        client = createGoogleGenerativeAI({
          apiKey: apiKey,
        })
        break
      default:
        throw new Error(`Unsupported provider: ${provider}`)
    }

    // This is a workaround to get models. The Vercel AI SDK does not have a direct API for listing models.
    // We have to try a dummy request and see what models are available.
    // This is not ideal, but it's a common approach.
    const response = await fetch(`${baseUrl}/models`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      const errorData: unknown = await response.json()
      let errorMessage = 'An unknown error occurred'
      if (typeof errorData === 'object' && errorData !== null && 'error' in errorData) {
        const errorPayload = errorData.error
        if (typeof errorPayload === 'object' && errorPayload !== null && 'message' in errorPayload && typeof (errorPayload as any).message === 'string') {
          errorMessage = (errorPayload as { message: string }).message
        } else if (typeof errorPayload === 'string') {
          errorMessage = errorPayload
        }
      }
      throw new Error(`Failed to fetch models: ${errorMessage}`)
    }

    const modelsData = (await response.json()) as ModelListResponse

    return modelsData.data
      .map((model: OpenAIModel) => ({
        id: model.id,
        name: model.id, // Or use a more descriptive name if available
      }))
      .sort((a: Model, b: Model) => a.name.localeCompare(b.name))
  } catch (error: any) {
    console.error('Error fetching models:', error)
    // Send a more user-friendly error message
    throw new Error(error.message || 'Failed to connect to the AI provider.')
  }
}

export async function generateCommitMessage(provider: string, apiKey: string, model: string, language: string, maxLength: number, diff: string, commitTypes: any, customBaseUrl?: string) {
  const baseUrl = customBaseUrl || providerBaseUrls[provider]
  if (!baseUrl && provider !== 'gemini') {
    throw new Error('Base URL not found for provider.')
  }

  let client

  switch (provider) {
    case 'openai':
    case 'xai':
    case 'openrouter':
    case 'custom':
      client = createOpenAI({
        apiKey: apiKey,
        baseURL: baseUrl,
      })
      break
    case 'gemini':
      client = createGoogleGenerativeAI({
        apiKey: apiKey,
      })
      break
    default:
      throw new Error(`Unsupported provider: ${provider}`)
  }

  const result = await streamText({
    model: client(model),
    prompt: generateTextPrompt(language, maxLength, diff, commitTypes),
  })

  Logger.debugToOutputChannel('Stream Text Request', {
    provider,
    model,
    apiKey,
    prompt: generateTextPrompt(language, maxLength, diff, commitTypes),
  })

  // Since this is a stream, we can't log the full response at once.
  // The stream is consumed in extension.ts.
  return result
}

export async function generateStructuredCommitMessage(provider: string, apiKey: string, model: string, language: string, maxLength: number, diff: string, commitTypes: any, customBaseUrl?: string) {
  const baseUrl = customBaseUrl || providerBaseUrls[provider]
  if (!baseUrl && provider !== 'gemini') {
    throw new Error('Base URL not found for provider.')
  }

  let client

  switch (provider) {
    case 'openai':
    case 'xai':
    case 'openrouter':
    case 'custom':
      client = createOpenAI({
        apiKey: apiKey,
        baseURL: baseUrl,
      })
      break
    case 'gemini':
      client = createGoogleGenerativeAI({
        apiKey: apiKey,
      })
      break
    default:
      throw new Error(`Unsupported provider: ${provider}`)
  }

  const { object } = await generateObject({
    model: client(model),
    schema: z.object({
      type: z.string(),
      scope: z.string().optional().nullable(),
      description: z.string(),
      body: z.string().optional().nullable(),
      footer: z.string().optional().nullable(),
    }),
    prompt: generateFormPrompt(language, maxLength, commitTypes, diff),
  })

  Logger.debugToOutputChannel('Generate Object Request', {
    provider,
    model,
    apiKey,
    prompt: generateFormPrompt(language, maxLength, commitTypes, diff),
  })

  Logger.debugToOutputChannel('Generate Object Response', object)

  return object
}
