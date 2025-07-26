<script lang="ts">
  export let currentTab: 'form' | 'text';

  const tabs: { id: 'form' | 'text'; label: string }[] = [
    { id: 'form', label: 'Form' },
    { id: 'text', label: 'Text' },
  ];
</script>

<div class="border-b" style="border-color: var(--vscode-editorGroupHeader-tabsBorder);">
  <nav class="-mb-px flex" aria-label="Tabs">
    {#each tabs as tab}
      <button
        on:click={() => (currentTab = tab.id)}
        class="whitespace-nowrap py-2 px-4 border-b-2 font-medium text-sm focus:outline-none"
        style:border-color={currentTab === tab.id ? 'var(--vscode-tab-activeBorder)' : 'transparent'}
        style:color={currentTab === tab.id ? 'var(--vscode-tab-activeForeground)' : 'var(--vscode-tab-inactiveForeground)'}
        class:hover:bg-gray-500={currentTab !== tab.id}
      >
        {tab.label}
      </button>
    {/each}
  </nav>
</div>
