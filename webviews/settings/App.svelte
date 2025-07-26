<script lang="ts">
  import { onMount } from 'svelte'
  import Eye from './components/icons/Eye.svelte'
  import EyeOff from './components/icons/EyeOff.svelte'

  // @ts-ignore
  const vscode = acquireVsCodeApi()

  interface ProviderSettings {
    apiKey: string
    model: string
    baseUrl?: string
  }

  interface Model {
    id: string
    name: string
  }

  interface AllSettings {
    activeProvider: string
    providers: {
      [key: string]: ProviderSettings
    }
  }

  // State
  let settings: AllSettings = {
    activeProvider: 'openai',
    providers: {},
  }

  let availableModels: Model[] = []
  let isLoadingModels = false
  let errorMessage = ''
  let apiKeyVisible = false

  const providerIds = [
    { id: 'openai', name: 'OpenAI' },
    { id: 'gemini', name: 'Google Gemini' },
    { id: 'xai', name: 'xAI' },
    { id: 'openrouter', name: 'OpenRouter' },
    { id: 'custom', name: 'Custom (OpenAI-compatible)' },
  ]

  // Reactive derived state
  $: currentProvider = settings.activeProvider
  $: currentProviderSettings = settings.providers[currentProvider] || { apiKey: '', model: '', baseUrl: '' }

  function getModels() {
    errorMessage = ''
    const conf = currentProviderSettings
    if (!conf.apiKey) {
      return
    }

    isLoadingModels = true
    availableModels = []

    vscode.postMessage({
      command: 'getModels',
      provider: currentProvider,
      apiKey: conf.apiKey,
      baseUrl: conf.baseUrl,
    })
  }

  function handleProviderChange() {
    // This function is triggered by the on:change event on the provider select
    if (!settings.providers[settings.activeProvider]) {
      settings.providers[settings.activeProvider] = { apiKey: '', model: '' }
    }
    // Reset and fetch models for the new provider
    availableModels = []
    errorMessage = ''
    apiKeyVisible = false // Hide API key on provider switch
    getModels()
  }

  function saveSettings() {
    vscode.postMessage({
      command: 'saveAiSettings',
      settings: settings,
    })
  }

  onMount(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data
      switch (message.command) {
        case 'loadSettings':
          if (message.settings) {
            settings = message.settings
            // Ensure providers object exists
            if (!settings.providers) {
              settings.providers = {}
            }
          }
          // Ensure all provider keys exist after loading
          for (const p of providerIds) {
            if (!settings.providers[p.id]) {
              settings.providers[p.id] = { apiKey: '', model: '' }
            }
          }
          getModels()
          break
        case 'loadModels':
          isLoadingModels = false
          availableModels = message.models
          // Auto-select first model if none is selected
          if (currentProviderSettings && !currentProviderSettings.model && message.models.length > 0) {
            settings.providers[currentProvider].model = message.models[0].id
          }
          break
        case 'loadModelsError':
          isLoadingModels = false
          errorMessage = message.error
          break
      }
    }
    window.addEventListener('message', handleMessage)
    vscode.postMessage({ command: 'requestInitialSettings' })
  })

  $: showBaseUrlInput = currentProvider === 'custom'
</script>

<div class="p-4 space-y-6">
  <h2 class="text-lg font-bold">AI Provider Settings</h2>

  <div class="space-y-4">
    <div class="space-y-2">
      <label for="aiProvider" class="block text-sm font-medium">AI Provider</label>
      <select id="aiProvider" class="w-full" bind:value={settings.activeProvider} on:change={handleProviderChange}>
        {#each providerIds as p}
          <option value={p.id}>{p.name}</option>
        {/each}
      </select>
    </div>

    <div class="space-y-2 relative">
      <label for="apiKey" class="block text-sm font-medium">API Key</label>
      {#if apiKeyVisible}
        <input id="apiKey" type="text" class="w-full pr-10" bind:value={currentProviderSettings.apiKey} on:blur={getModels} placeholder="Enter your API key" />
      {:else}
        <input id="apiKey" type="password" class="w-full pr-10" bind:value={currentProviderSettings.apiKey} on:blur={getModels} placeholder="Enter your API key" />
      {/if}
      <button class="absolute inset-y-0 right-0 top-6 flex items-center pr-3" on:click={() => (apiKeyVisible = !apiKeyVisible)} title={apiKeyVisible ? 'Hide API Key' : 'Show API Key'}>
        {#if apiKeyVisible}
          <EyeOff class="h-5 w-5" style="color: var(--vscode-icon-foreground);" />
        {:else}
          <Eye class="h-5 w-5" style="color: var(--vscode-icon-foreground);" />
        {/if}
      </button>
    </div>

    {#if showBaseUrlInput}
      <div class="space-y-2">
        <label for="baseUrl" class="block text-sm font-medium">API Base URL (Required)</label>
        <input id="baseUrl" type="text" class="w-full" bind:value={currentProviderSettings.baseUrl} on:blur={getModels} placeholder="e.g., https://api.example.com/v1" />
        <p class="text-sm" style="color: var(--vscode-descriptionForeground);">The custom endpoint must be compatible with the OpenAI API spec.</p>
      </div>
    {/if}

    <div class="space-y-2">
      <label for="model" class="block text-sm font-medium">Model</label>
      <select id="model" class="w-full" bind:value={currentProviderSettings.model} disabled={isLoadingModels || availableModels.length === 0}>
        {#if isLoadingModels}
          <option value="">Loading models...</option>
        {:else if availableModels.length > 0}
          {#each availableModels as model}
            <option value={model.id}>{model.name}</option>
          {/each}
        {:else}
          <option value="">Enter API key to load models</option>
        {/if}
      </select>
    </div>

    <div class="pt-2">
      <button
        class="w-full inline-flex justify-center py-1 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md"
        style="background-color: var(--vscode-button-background); color: var(--vscode-button-foreground);"
        on:click={saveSettings}
      >
        Save AI Configuration
      </button>
    </div>

    {#if errorMessage}
      <div class="border-t" style="border-color: var(--vscode-input-border); margin-top: 1rem; padding-top: 1rem;">
        <p class="text-sm font-medium" style="color: var(--vscode-errorForeground);">Error Details:</p>
        <pre class="text-xs whitespace-pre-wrap" style="color: var(--vscode-descriptionForeground);">{errorMessage}</pre>
      </div>
    {/if}
  </div>
</div>

<style>
  input,
  select {
    background-color: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
    border: 1px solid var(--vscode-input-border);
    border-radius: 2px;
    padding: 4px;
    font-size: var(--vscode-font-size);
  }
  select {
    -webkit-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23${'var(--vscode-icon-foreground)'.replace('#', '')}' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    background-size: 1em;
    padding-right: 2rem;
  }
  input:focus,
  select:focus {
    outline: 1px solid var(--vscode-focusBorder);
    outline-offset: -1px;
  }
</style>
