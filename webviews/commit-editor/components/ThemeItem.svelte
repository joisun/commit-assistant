<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import Minus from './icons/Minus.svelte';
  import Edit from './icons/Edit.svelte';
  import Check from './icons/Check.svelte';
  import {
    type ThemeDeadlineConfig,
    calculateDeadlineStatus,
    getDeadlineColors,
  } from '../../../src/constants/theme-deadline';

  export let flagName: string;
  export let themeName: string;
  export let deadline: string | undefined;
  export let docUrl: string | undefined;
  export let themeDeadlineConfig: ThemeDeadlineConfig;

  const dispatch = createEventDispatcher();

  let currentDeadline = deadline;
  let isEditingUrl = false;
  let editingUrlValue = '';

  $: status = calculateDeadlineStatus(currentDeadline, themeDeadlineConfig);
  $: colors = getDeadlineColors(status, themeDeadlineConfig);

  function updateTheme() {
    dispatch('updateTheme', { flagName, themeName, deadline: currentDeadline, docUrl });
  }

  function deleteTheme() {
    dispatch('deleteTheme', { flagName, themeName });
  }

  function startEditing() {
    editingUrlValue = docUrl || '';
    isEditingUrl = true;
  }

  function saveUrl() {
    docUrl = editingUrlValue;
    isEditingUrl = false;
    updateTheme();
  }

  function cancelEditing() {
    isEditingUrl = false;
  }

  function openUrl() {
    if (docUrl) {
      dispatch('openUrl', docUrl);
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      saveUrl();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  }
</script>

<div class="theme-item">
  <span class="text-sm truncate mr-2" title={themeName}>{themeName}</span>
  <div class="flex items-center space-x-1.5 flex-shrink-0">
    {#if isEditingUrl}
      <div class="flex items-center space-x-1">
        <input
          type="text"
          class="url-input"
          bind:value={editingUrlValue}
          placeholder="https://..."
          on:keydown={handleKeydown}
        />
        <button on:click={saveUrl} class="action-button" title="Save URL">
          <Check class="w-3.5 h-3.5" />
        </button>
      </div>
    {:else}
      {#if docUrl}
        <button on:click={openUrl} class="url-text-link" title={docUrl}>
          {docUrl}
        </button>
        <button on:click={startEditing} class="action-button" title="Edit URL">
          <Edit class="w-3.5 h-3.5" />
        </button>
      {:else}
        <button on:click={startEditing} class="action-button opacity-50 hover:opacity-100" title="Add URL">
          <Edit class="w-3.5 h-3.5" />
        </button>
      {/if}
    {/if}

    <input
      type="date"
      class="deadline-input"
      style="color: {colors.text}; background-color: {colors.bg};"
      bind:value={currentDeadline}
      on:change={updateTheme}
    />

    <button on:click={deleteTheme} class="delete-theme-button ml-1">
      <Minus className="w-3.5 h-3.5" />
    </button>
  </div>
</div>

<style>
  .theme-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 24px;
    padding-left: 6px;
    padding-right: 2px;
    border-radius: 3px;
    background-color: rgba(var(--vscode-editor-foreground-rgb), 0.04);
  }
  .theme-item span {
    flex-grow: 1;
    min-width: 0;
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
  .url-input {
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
  .action-button {
    color: var(--vscode-editor-foreground);
    background-color: transparent;
  }
  .action-button:hover {
    background-color: rgba(var(--vscode-editor-foreground-rgb), 0.1);
  }
  .url-text-link {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-decoration: underline;
    color: var(--vscode-textLink-foreground);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 11px;
    padding: 0 4px;
    display: block;
    width: auto;
    height: 20px;
    line-height: 20px;
  }
  .url-text-link:hover {
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
