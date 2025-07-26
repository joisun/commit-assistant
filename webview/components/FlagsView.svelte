<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Plus from './icons/Plus.svelte';
  import FlagItem from './FlagItem.svelte';

  export let flags: Record<string, string[]> = {};

  let newFlagName = '';

  function addFlag() {
    if (!newFlagName.trim()) {
      return;
    }
    if (newFlagName && !flags[newFlagName]) {
      flags[newFlagName] = [];
      flags = flags; // Trigger reactivity
      newFlagName = '';
    }
  }

  function handleAddTheme(event: CustomEvent) {
    const { flagName, themeName } = event.detail;
    if (themeName && !flags[flagName].includes(themeName)) {
      flags[flagName] = [...flags[flagName], themeName];
      flags = flags; // Trigger reactivity
    }
  }

  function handleDeleteTheme(event: CustomEvent) {
    const { flagName, themeName } = event.detail;
    flags[flagName] = flags[flagName].filter((t) => t !== themeName);
    flags = flags; // Trigger reactivity
  }

  function handleDeleteFlag(event: CustomEvent) {
    const flagName = event.detail;
    delete flags[flagName];
    flags = flags; // Trigger reactivity
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addFlag();
    }
  }
</script>

<div class="space-y-2">
  <h3 class="text-base font-medium">Manage Flags</h3>

  <div class="space-y-1.5">
    {#each Object.entries(flags) as [flagName, themes]}
      <FlagItem
        {flagName}
        {themes}
        on:addTheme={handleAddTheme}
        on:deleteTheme={handleDeleteTheme}
        on:deleteFlag={handleDeleteFlag}
      />
    {/each}
  </div>

  <div class="flex space-x-1.5 h-6 items-center">
    <input type="text" bind:value={newFlagName} placeholder="New flag name..." class="w-full" on:keydown={handleKeydown}>
    <button on:click={addFlag} class="add-flag-button">
      Add Flag
    </button>
  </div>
</div>

<style>
  input {
    background-color: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
    border: 1px solid var(--vscode-input-border);
    border-radius: 3px;
    padding: 1px 6px;
    font-size: var(--vscode-font-size);
    height: 100%;
  }
  .add-flag-button {
    border-radius: 3px;
    border: none;
    cursor: pointer;
    color: var(--vscode-button-background);
    background-color: rgba(var(--vscode-button-background-rgb), 0.1);
    transition: all 0.15s ease-in-out;
    padding: 0 8px;
    white-space: nowrap;
    height: 100%;
    font-size: var(--vscode-font-size);
  }
  .add-flag-button:hover {
    color: var(--vscode-button-background);
    background-color: rgba(var(--vscode-button-background-rgb), 0.2);
    opacity: 0.9;
  }
</style>
