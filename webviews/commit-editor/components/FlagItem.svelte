<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Trash from './icons/Trash.svelte';
  import Plus from './icons/Plus.svelte';
  import Minus from './icons/Minus.svelte';

  export let flagName: string;
  export let themes: string[];

  const dispatch = createEventDispatcher();

  let newThemeName = '';

  function addTheme() {
    if (!newThemeName.trim()) {
      return;
    }
    dispatch('addTheme', { flagName, themeName: newThemeName });
    newThemeName = '';
  }

  function deleteTheme(themeName: string) {
    dispatch('deleteTheme', { flagName, themeName });
  }

  function deleteFlag() {
    dispatch('deleteFlag', flagName);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTheme();
    }
  }
</script>

<div class="rounded-md" style="background-color: var(--vscode-sideBar-background);">
  <div class="flex justify-between items-center py-1.5 pl-2.5 pr-1">
    <h4 class="text-sm font-semibold">{flagName}</h4>
    <button on:click={deleteFlag} class="delete-flag-button">
      <Trash className="w-3.5 h-3.5" />
    </button>
  </div>

  <div class="pl-4 pr-1 pb-1.5">
    <div class="space-y-0.5">
      {#each themes as theme}
      <div class="theme-item">
          <span class="text-sm">{theme}</span>
          <button on:click={() => deleteTheme(theme)} class="delete-theme-button">
          <Minus className="w-3.5 h-3.5" />
          </button>
      </div>
      {/each}
    </div>
    <div class="flex space-x-1.5 mt-1.5 h-6 items-center">
      <input type="text" bind:value={newThemeName} placeholder="New theme..." class="w-full" on:keydown={handleKeydown}>
      <button on:click={addTheme} class="add-button">
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
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
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 3px;
    border: none;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.15s ease-in-out;
  }
  .theme-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 24px;
    padding-left: 6px;
    padding-right: 0px;
    border-radius: 3px;
    background-color: rgba(var(--vscode-editor-foreground-rgb), 0.04);
  }
  .add-button {
    color: var(--vscode-editor-foreground);
    background-color: rgba(var(--vscode-editor-foreground-rgb), 0.1);
  }
  .add-button:hover {
    background-color: rgba(var(--vscode-editor-foreground-rgb), 0.15);
    opacity: 0.8;
  }
  .delete-flag-button {
    color: var(--vscode-editor-foreground);
    background-color: rgba(var(--vscode-editor-foreground-rgb), 0.1);
  }
  .delete-flag-button:hover {
    background-color: rgba(var(--vscode-editor-foreground-rgb), 0.15);
    opacity: 0.8;
  }
  .delete-theme-button {
    color: var(--vscode-editor-foreground);
    background-color: rgba(var(--vscode-editor-foreground-rgb), 0.1);
  }
  .delete-theme-button:hover {
    background-color: rgba(var(--vscode-editor-foreground-rgb), 0.15);
    opacity: 0.8;
  }
</style>
