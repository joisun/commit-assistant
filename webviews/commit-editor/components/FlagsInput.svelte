<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import FlagRow from './FlagRow.svelte'
  import Plus from './icons/Plus.svelte'

  export let selectedFlags: { flag: string; theme: string }[] = []
  export let availableFlags: Record<string, string[]> = {}

  const dispatch = createEventDispatcher()

  function addFlagRow() {
    selectedFlags = [...selectedFlags, { flag: '', theme: '' }]
    dispatch('change', selectedFlags)
  }

  function handleFlagUpdate(index: number, detail: { field: 'flag' | 'theme'; value: string }) {
    selectedFlags[index][detail.field] = detail.value
    if (detail.field === 'flag') {
      selectedFlags[index].theme = ''
    }
    dispatch('change', selectedFlags)
  }

  function handleFlagRemove(index: number) {
    selectedFlags = selectedFlags.filter((_, i) => i !== index)
    dispatch('change', selectedFlags)
  }
</script>

<div>
  <label class="block text-sm font-medium mb-1">Flags <span class="text-gray-400">(optional)</span></label>
  <div class="space-y-2">
    {#each selectedFlags as { flag, theme }, index}
      <FlagRow selectedFlag={flag} selectedTheme={theme} {availableFlags} on:update={(e) => handleFlagUpdate(index, e.detail)} on:remove={() => handleFlagRemove(index)} />
    {/each}
    <button on:click={addFlagRow} class="add-flag-button">
      <Plus />
      <span>Add Flag</span>
    </button>
  </div>
</div>

<style>
  label {
    color: var(--vscode-foreground);
  }
  .add-flag-button {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background: none;
    border: 1px solid var(--vscode-button-secondaryBackground);
    color: var(--vscode-foreground);
    padding: 2px 8px;
    border-radius: 2px;
    cursor: pointer;
    transition: background-color 0.15s ease-in-out;
  }
  .add-flag-button:hover {
    background-color: var(--vscode-button-secondaryHoverBackground);
  }
</style>
