<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte'
  import AITrigger from './AITrigger.svelte'
  import FlagsInput from './FlagsInput.svelte'

  export let value: string
  export let commitData: {
    selectedFlags: { flag: string; theme: string }[]
  }
  export let flags: Record<string, Record<string, { deadline?: string; docUrl?: string }>> = {}
  export let themeDeadlineConfig: any;
  export let disabled = false
  export let loading = false
  export let vscode: any
  let textarea: HTMLTextAreaElement

  const dispatch = createEventDispatcher()

  function handleFlagsChange(event: CustomEvent) {
    commitData.selectedFlags = event.detail
    dispatch('change', commitData)
  }

  function handleOpenUrl(event: CustomEvent) {
    dispatch('openUrl', event.detail);
  }

  function autoGrow() {
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  onMount(() => {
    autoGrow()
  })

  $: if (value) {
    if (textarea) {
      autoGrow()
    }
  }

  function handleAIGenerate() {
    // 清除当前的文本内容
    value = ''

    // 发送 AI 生成请求
    vscode.postMessage({ command: 'generateAiCommitForText' })
  }
</script>

<div>
  <div class="flex justify-between items-center mb-1">
    <label for="commit-text" class="block text-sm font-medium">Commit Message</label>
    <AITrigger on:click={handleAIGenerate} {disabled} {loading} />
  </div>
  <textarea bind:this={textarea} id="commit-text" rows="4" bind:value on:input={autoGrow} placeholder="Write your commit message here..." class="w-full resize-none overflow-hidden"></textarea>

  <div class="mt-4">
    <FlagsInput
      selectedFlags={commitData.selectedFlags}
      availableFlags={flags}
      on:change={handleFlagsChange}
      {themeDeadlineConfig}
      on:openUrl={handleOpenUrl}
    />
  </div>
</div>

<style>
  label {
    color: var(--vscode-foreground);
  }
  textarea {
    background-color: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
    border: 1px solid var(--vscode-input-border);
    border-radius: 2px;
    padding: 4px;
    font-size: var(--vscode-font-size);
  }
  textarea:focus {
    outline: 1px solid var(--vscode-focusBorder);
    outline-offset: -1px;
  }
</style>
