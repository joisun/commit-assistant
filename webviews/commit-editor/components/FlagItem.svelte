<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Trash from './icons/Trash.svelte';
  import Plus from './icons/Plus.svelte';
  import Minus from './icons/Minus.svelte';
  import ThemeItem from './ThemeItem.svelte';
  import {
    type ThemeDeadlineConfig,
    calculateDeadlineStatus,
    getDeadlineColors,
  } from '../../../src/constants/theme-deadline';

  export let flagName: string;
  export let themes: Record<string, { deadline?: string; docUrl?: string }>;
  export let themeDeadlineConfig: ThemeDeadlineConfig;

  const dispatch = createEventDispatcher();

  let newThemeName = '';
  let newThemeDeadline = '';
  let newThemeDocUrl = '';

  function addTheme() {
    if (!newThemeName.trim()) {
      return;
    }
    dispatch('addTheme', { flagName, themeName: newThemeName, deadline: newThemeDeadline, docUrl: newThemeDocUrl });
    newThemeName = '';
    newThemeDeadline = '';
    newThemeDocUrl = '';
  }

  function updateTheme(event: CustomEvent) {
    dispatch('updateTheme', event.detail);
  }

  function deleteTheme(event: CustomEvent) {
    dispatch('deleteTheme', event.detail);
  }

  function openUrl(event: CustomEvent) {
    dispatch('openUrl', event.detail);
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
    <button 
      on:click={deleteFlag} 
      class="delete-flag-button" 
      disabled={Object.keys(themes).length > 0}
      title={Object.keys(themes).length > 0 ? "Cannot delete flag with themes" : "Delete flag"}
    >
      <Trash className="w-3.5 h-3.5" />
    </button>
  </div>

  <div class="pl-4 pr-1 pb-1.5">
    <div class="space-y-0.5">
      {#each Object.entries(themes) as [themeName, data]}
        <ThemeItem
          {flagName}
          {themeName}
          deadline={data.deadline}
          docUrl={data.docUrl}
          scope={data.scope}
          {themeDeadlineConfig}
          on:updateTheme={updateTheme}
          on:deleteTheme={deleteTheme}
          on:openUrl={openUrl}
        />
      {/each}
    </div>
    <div class="flex space-x-1.5 mt-1.5 h-6 items-center">
      <input type="text" bind:value={newThemeName} placeholder="New theme..." class="theme-name-input" on:keydown={handleKeydown} />
      <input type="text" bind:value={newThemeDocUrl} placeholder="Doc URL" class="doc-url-input" on:keydown={handleKeydown} />
      <input type="date" bind:value={newThemeDeadline} class="deadline-input" />
      <button on:click={addTheme} class="add-button">
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</div>

<style>
  .theme-name-input {
    box-sizing: border-box;
    background-color: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
    border: 1px solid var(--vscode-input-border);
    border-radius: 3px;
    padding: 1px 4px;
    font-size: 11px;
    height: 20px;
    width: 100%; /* theme name input should fill remaining space */
  }
  .doc-url-input {
    box-sizing: border-box;
    background-color: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
    border: 1px solid var(--vscode-input-border);
    border-radius: 3px;
    padding: 1px 4px;
    font-size: 11px;
    height: 20px;
    width: 200px;
    flex-shrink: 0;
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
  .delete-flag-button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  .delete-flag-button:disabled:hover {
    background-color: rgba(var(--vscode-editor-foreground-rgb), 0.1);
  }
  .deadline-input {
    box-sizing: border-box;
    background-color: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
    border: 1px solid var(--vscode-input-border);
    border-radius: 3px;
    padding: 1px 4px;
    font-size: 11px;
    height: 20px;
    width: 110px;
    min-width: 110px;
    max-width: 110px;
    flex-shrink: 0;
  }
</style>
