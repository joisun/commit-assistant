<script lang="ts">
  export let currentTab: 'form' | 'text' | 'flags';

  const tabs: { id: 'form' | 'text' | 'flags'; label: string }[] = [
    { id: 'form', label: 'Form' },
    { id: 'text', label: 'Text' },
    { id: 'flags', label: 'Flags' },
  ];
</script>

<div class="border-b" style="border-color: var(--vscode-editorGroupHeader-tabsBorder);">
  <nav class="-mb-px flex" aria-label="Tabs">
    {#each tabs as tab}
      <button
        on:click={() => (currentTab = tab.id)}
        class="tab-button whitespace-nowrap py-2 px-4 border-b-2 font-medium text-sm focus:outline-none"
        class:active={currentTab === tab.id}
        style:border-color={currentTab === tab.id
          ? 'var(--vscode-tab-activeBorder)'
          : 'transparent'}
      >
        {tab.label}
      </button>
    {/each}
  </nav>
</div>

<style>
  .tab-button {
    color: var(--vscode-tab-inactiveForeground);
    background: transparent;
    transition: color 0.2s ease-in-out;
  }
  .tab-button.active {
    color: var(--vscode-tab-activeForeground);
  }
  .tab-button:not(.active):hover {
    color: var(--vscode-tab-hoverForeground, var(--vscode-tab-activeForeground));
  }
</style>
