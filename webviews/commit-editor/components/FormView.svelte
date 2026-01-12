<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import AITrigger from './AITrigger.svelte'
  import CustomSelect from './CustomSelect.svelte'
  import FlagsInput from './FlagsInput.svelte'
  import type { ThemeDeadlineConfig } from '../../../src/constants/theme-deadline';

  import type { ThemeDeadlineConfig } from '../../../src/constants/theme-deadline';

  export let commitData: {
    type: string
    scope: string
    description: string
    body: string
    footer: string
    selectedFlags: { flag: string; theme: string }[]
  }

  export let flags: Record<string, Record<string, { deadline?: string }>> = {}
  export let commitTypes: { value: string; label: string; description?: string }[] = []
  export let themeDeadlineConfig: ThemeDeadlineConfig;
  export let disabled = false
  export let loading = false
  export let vscode: any

  let aiFieldConfig = {
    scope: false,
    body: false,
  }

  const dispatch = createEventDispatcher()

  function update(field: keyof Omit<typeof commitData, 'selectedFlags'>, value: string) {
    const newCommitData = { ...commitData, [field]: value }
    dispatch('change', newCommitData)
  }

  function handleFlagsChange(event: CustomEvent) {
    commitData.selectedFlags = event.detail
    dispatch('change', commitData)
  }

  function handleAIGenerate() {
    // 清除将要被 AI 生成的字段
    const clearedData = { ...commitData }

    // 根据 aiFieldConfig 清除相应字段
    if (aiFieldConfig.scope) {
      clearedData.scope = ''
    }
    if (aiFieldConfig.body) {
      clearedData.body = ''
    }

    // 总是清除 description，因为 AI 总是会生成它
    clearedData.description = ''

    // 可选：也清除 footer，如果你希望 AI 重新生成
    // clearedData.footer = ''

    dispatch('change', clearedData)

    // 发送 AI 生成请求
    vscode.postMessage({
      command: 'generateAiCommitForForm',
      config: aiFieldConfig,
    })
  }
</script>

<div class="space-y-4">
  <div class="flex justify-between items-center">
    <h3 class="text-base font-medium">Form</h3>
    <AITrigger
      on:click={handleAIGenerate}
      {disabled}
      {loading}
    />
  </div>
  <FlagsInput selectedFlags={commitData.selectedFlags} availableFlags={flags} on:change={handleFlagsChange} {themeDeadlineConfig} />
  <div>
    <label for="type" class="block text-sm font-medium mb-1">Type</label>
    <CustomSelect items={commitTypes} selectedValue={commitData.type} on:change={(e) => update('type', e.detail)} placeholder="Select type..." />
  </div>
  <div class="flex items-center justify-between pr-2">
    <label for="scope" class="block text-sm font-medium">Scope <span class="text-gray-400">(optional)</span></label>
    <input type="checkbox" bind:checked={aiFieldConfig.scope} title="Generate AI content for this field" />
  </div>
  <input type="text" id="scope" class="w-full" value={commitData.scope} on:input={(e) => update('scope', e.currentTarget.value)} placeholder="e.g., auth, ui, api" />
  <div>
    <label for="description" class="block text-sm font-medium mb-1">Description</label>
    <input
      type="text"
      id="description"
      class="w-full"
      value={commitData.description}
      on:input={(e) => update('description', e.currentTarget.value)}
      placeholder="Brief description of changes"
      maxlength="72"
    />
  </div>
  <div class="flex items-center justify-between pr-2">
    <label for="body" class="block text-sm font-medium">Body <span class="text-gray-400">(optional)</span></label>
    <input type="checkbox" bind:checked={aiFieldConfig.body} title="Generate AI content for this field" />
  </div>
  <textarea id="body" rows="4" class="w-full" value={commitData.body} on:input={(e) => update('body', e.currentTarget.value)} placeholder="Detailed description of changes"></textarea>
  <div>
    <label for="footer" class="block text-sm font-medium mb-1">Footer <span class="text-gray-400">(optional)</span></label>
    <textarea id="footer" rows="2" class="w-full" value={commitData.footer} on:input={(e) => update('footer', e.currentTarget.value)} placeholder="e.g., Closes #123, Breaking change info"></textarea>
  </div>
</div>

<style>
  label {
    color: var(--vscode-foreground);
  }
  input,
  textarea {
    background-color: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
    border: 1px solid var(--vscode-input-border);
    border-radius: 2px;
    padding: 4px;
    font-size: var(--vscode-font-size);
  }
  input:focus,
  textarea:focus {
    outline: 1px solid var(--vscode-focusBorder);
    outline-offset: -1px;
  }
  .add-flag-button {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background: none;
    border: 1px solid var(--vscode-button-secondaryBackground);
    color: var(--vscode-foreground); /* Use a more general foreground color */
    padding: 2px 8px;
    border-radius: 2px;
    cursor: pointer;
    transition: background-color 0.15s ease-in-out;
  }
  .add-flag-button:hover {
    background-color: var(--vscode-button-secondaryHoverBackground);
  }

  input[type='checkbox'] {
    appearance: none;
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border: 1px solid var(--vscode-input-border);
    border-radius: 3px;
    background-color: var(--vscode-input-background);
    cursor: pointer;
    position: relative;
    transition: background-color 0.15s ease-in-out;
  }

  input[type='checkbox']:checked {
    background-color: var(--vscode-button-background);
    border-color: var(--vscode-button-background);
  }

  input[type='checkbox']:checked::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 5px;
    width: 4px;
    height: 8px;
    border: solid var(--vscode-button-foreground);
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  input[type='checkbox']:focus {
    outline: 1px solid var(--vscode-focusBorder);
    outline-offset: 1px;
  }
</style>
