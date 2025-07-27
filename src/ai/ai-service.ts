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
        let errorMessage = 'An unknown error occurred'
        if (typeof errorData === 'object' && errorData !== null && 'error' in errorData) {
          const errorPayload = (errorData as any).error
          if (typeof errorPayload === 'object' && errorPayload !== null && 'message' in errorPayload) {
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
      throw new Error(`Unsupported provider: ${provider}`)
    }
    const response = await fetch(`${baseUrl}/models`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
    if (!response.ok) {
      const errorData: unknown = await response.json()
      let errorMessage = 'An unknown error occurred'
      if (typeof errorData === 'object' && errorData !== null && 'error' in errorData) {
        const errorPayload = (errorData as any).error
        if (typeof errorPayload === 'object' && errorPayload !== null && 'message' in errorPayload) {
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
        name: model.id,
      }))
      .sort((a: Model, b: Model) => a.name.localeCompare(b.name))
  } catch (error: any) {
    console.error('Error fetching models:', error)
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
      client = createOpenAI({ apiKey, baseURL: baseUrl })
      break
    case 'gemini':
      client = createGoogleGenerativeAI({ apiKey })
      break
    default:
      throw new Error(`Unsupported provider: ${provider}`)
  }

  const prompt = generateTextPrompt(language, maxLength, diff, commitTypes)

  Logger.debugToOutputChannel('Stream Text Request', {
    provider,
    model,
    apiKey,
    prompt,
  })

  const result = await streamText({
    model: client(model),
    prompt,
  })

  return result
}

export async function generateStructuredCommitMessage(
  provider: string,
  apiKey: string,
  model: string,
  language: string,
  maxLength: number,
  diff: string,
  commitTypes: any,
  aiFieldConfig: { scope: boolean; body: boolean; footer: boolean },
  customBaseUrl?: string
) {
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
      client = createOpenAI({ apiKey, baseURL: baseUrl })
      break
    case 'gemini':
      client = createGoogleGenerativeAI({ apiKey })
      break
    default:
      throw new Error(`Unsupported provider: ${provider}`)
  }

  const schema = z.object({
    type: z.string(),
    description: z.string(),
    scope: aiFieldConfig.scope ? z.string().optional().nullable() : z.undefined().optional(),
    body: aiFieldConfig.body ? z.string().optional().nullable() : z.undefined().optional(),
    footer: aiFieldConfig.footer ? z.string().optional().nullable() : z.undefined().optional(),
  })

  const prompt = generateFormPrompt(language, maxLength, commitTypes, diff, aiFieldConfig)

  Logger.debugToOutputChannel('Generate Object Request', {
    provider,
    model,
    apiKey,
    prompt,
  })

  const { object } = await generateObject({
    model: client(model),
    schema,
    prompt,
  })

  Logger.debugToOutputChannel('Generate Object Response', object)

  return object
}
