<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Minus from './icons/Minus.svelte';
  import {
    calculateDeadlineStatus,
    formatDeadline,
    getDeadlineColors,
    type ThemeDeadlineConfig,
  } from '../../../src/constants/theme-deadline';

  export let selectedFlag: string;
  export let selectedTheme: string;
  export let availableFlags: Record<string, Record<string, { deadline?: string; docUrl?: string }>> = {};
  export let themeDeadlineConfig: ThemeDeadlineConfig;

  const dispatch = createEventDispatcher();

  function update(field: 'flag' | 'theme', value: string) {
    dispatch('update', { field, value });
  }

  function remove() {
    dispatch('remove');
  }

  function openUrl(url: string) {
    dispatch('openUrl', url);
  }

  $: availableThemes = Object.keys(availableFlags[selectedFlag] || {});
  $: selectedThemeData = selectedFlag && selectedTheme ? availableFlags[selectedFlag]?.[selectedTheme] : undefined;
  $: deadlineStatus = calculateDeadlineStatus(selectedThemeData?.deadline, themeDeadlineConfig);
  $: deadlineColors = getDeadlineColors(deadlineStatus, themeDeadlineConfig);
</script>

<div class="flex items-center space-x-2">
  <div class="flex-1">
    <select class="w-full" value={selectedFlag} on:change={(e) => update('flag', e.currentTarget.value)}>
      <option value="">Select flag...</option>
      {#each Object.keys(availableFlags) as flag}
        <option value={flag}>{flag}</option>
      {/each}
    </select>
  </div>
  <div class="flex-1">
    <select class="w-full" value={selectedTheme} on:change={(e) => update('theme', e.currentTarget.value)} disabled={!selectedFlag || availableThemes.length === 0}>
      <option value="">Select theme...</option>
      {#each availableThemes as theme}
        {@const status = calculateDeadlineStatus(availableFlags[selectedFlag]?.[theme]?.deadline, themeDeadlineConfig)}
        {@const colors = getDeadlineColors(status, themeDeadlineConfig)}
        <option value={theme}>
          {theme}
          {#if availableFlags[selectedFlag]?.[theme]?.deadline}
            ({formatDeadline(availableFlags[selectedFlag][theme].deadline)}) - Status: {status}
          {/if}
        </option>
      {/each}
    </select>
  </div>
  <button on:click={remove} class="remove-button" title="Remove Flag">
    <Minus />
  </button>
</div>

{#if selectedThemeData?.deadline || selectedThemeData?.docUrl}
  <div class="text-[11px] mt-1 flex items-center space-x-3 overflow-hidden whitespace-nowrap">
    {#if selectedThemeData?.deadline}
      <span style="color: {deadlineColors.text}" class="flex-shrink-0">
        Deadline: {formatDeadline(selectedThemeData.deadline)}
      </span>
    {/if}
    {#if selectedThemeData?.docUrl}
      <button
        on:click={() => openUrl(selectedThemeData.docUrl)}
        class="flex-1 min-w-0 truncate opacity-80 text-left hover:opacity-100 hover:underline transition-opacity"
        title={selectedThemeData.docUrl}
      >
        URL: {selectedThemeData.docUrl}
      </button>
    {/if}
  </div>
{/if}

<style>
  button.flex-1 {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: inherit;
    font-size: inherit;
    font-family: inherit;
    text-decoration: underline;
  }
  select {
    background-color: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
    border: 1px solid var(--vscode-input-border);
    border-radius: 2px;
    padding: 4px;
    font-size: var(--vscode-font-size);
    -webkit-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23${'var(--vscode-icon-foreground)'.replace('#', '')}' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    background-size: 1em;
    padding-right: 2rem;
  }
  select option {
    font-size: 0.85em; /* Smaller font size for options */
  }
  select:focus {
    outline: 1px solid var(--vscode-focusBorder);
    outline-offset: -1px;
  }
  .remove-button {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--vscode-icon-foreground);
    opacity: 0.7;
    transition: opacity 0.15s ease-in-out;
  }
  .remove-button:hover {
    opacity: 1;
  }
</style>
