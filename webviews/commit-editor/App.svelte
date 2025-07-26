<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import Tabs from './components/Tabs.svelte'
  import FormView from './components/FormView.svelte'
  import TextView from './components/TextView.svelte'
  import Actions from './components/Actions.svelte'
  import FlagsView from './components/FlagsView.svelte'
  import SettingsIcon from './components/icons/Settings.svelte'

  // @ts-ignore
  const vscode = acquireVsCodeApi()

  let currentView: 'form' | 'text' | 'flags' = 'form'

  let commitData = {
    type: '',
    scope: '',
    description: '',
    body: '',
    footer: '',
    selectedFlags: [] as { flag: string; theme: string }[],
  }

  let textContent = ''
  let flags: Record<string, string[]> = {}
  let commitTypes: { value: string; label: string; description?: string }[] = []
  let preview = ''

  function generateCommitFromForm() {
    const { type, scope, description, body, footer, selectedFlags } = commitData
    if (!type || !description) return ''

    let message = type
    if (scope) message += `(${scope})`
    message += `: ${description}`
    if (body) message += `\n\n${body}`

    const flagFooters = selectedFlags.filter((item) => item.flag && item.theme).map((item) => `#${item.flag}:${item.theme}`)

    let finalFooter = footer
    if (flagFooters.length > 0) {
      const allFlagFooters = flagFooters.join('\n')
      finalFooter = finalFooter ? `${finalFooter}\n${allFlagFooters}` : allFlagFooters
    }

    if (finalFooter) message += `\n\n${finalFooter}`

    return message
  }

  function saveCommit() {
    if (!preview.trim()) {
      vscode.postMessage({ command: 'showError', text: 'Commit message cannot be empty.' })
      return
    }
    vscode.postMessage({ command: 'saveCommit', text: preview })
  }

  function cancel() {
    vscode.postMessage({ command: 'cancel' })
  }

  function handleKeydown(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault()
      saveCommit()
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      cancel()
    }
  }

  onMount(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data
      switch (message.command) {
        case 'loadState':
          const state = message.state
          if (!state) return

          currentView = state.currentView || 'form'
          const loadedCommitData = state.commitData
          if (loadedCommitData) {
            commitData.type = loadedCommitData.type || ''
            commitData.scope = loadedCommitData.scope || ''
            commitData.description = loadedCommitData.description || ''
            commitData.body = loadedCommitData.body || ''
            commitData.footer = loadedCommitData.footer || ''
            commitData.selectedFlags = loadedCommitData.selectedFlags || []
          }
          textContent = state.textContent || ''
          flags = state.flags || {}
          break
        case 'loadConfig':
          flags = message.config.flags || {}
          commitTypes = message.config.commitTypes || []
          break
      }
    }

    window.addEventListener('message', handleMessage)
    document.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('message', handleMessage)
      document.removeEventListener('keydown', handleKeydown)
    }
  })

  $: {
    if (currentView === 'form') {
      preview = generateCommitFromForm()
    } else {
      preview = textContent
    }
    // This makes the block reactive to commitData and flags
    JSON.stringify(commitData)
    JSON.stringify(flags)

    // Post the state to the extension host
    vscode.postMessage({
      command: 'saveState',
      state: { currentView, commitData, textContent, flags },
    })
  }
</script>

<main class="p-4 sm:p-6 font-sans flex flex-col h-screen">
  <div class="flex-shrink-0">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-bold">🤖 Commit Assistant</h1>
      <button on:click={() => vscode.postMessage({ command: 'openSettings' })} class="p-1 rounded-md hover:bg-gray-500/20" title="Settings">
        <SettingsIcon class="w-5 h-5" />
      </button>
    </div>
    <Tabs bind:currentTab={currentView} />
  </div>

  <div class="flex-grow overflow-y-auto mt-4">
    {#if currentView === 'form'}
      <FormView
        bind:commitData
        {flags}
        {commitTypes}
        on:change={(e) => {
          commitData = e.detail
        }}
      />
    {:else if currentView === 'text'}
      <TextView bind:value={textContent} />
    {:else if currentView === 'flags'}
      <FlagsView bind:flags />
    {/if}
  </div>

  <div class="flex-shrink-0 mt-4">
    <Actions on:save={saveCommit} on:cancel={cancel} />
  </div>
</main>

<style>
  :global(body) {
    background-color: var(--vscode-editor-background);
    color: var(--vscode-editor-foreground);
  }
</style>
