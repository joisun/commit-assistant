<script lang="ts">
  export let currentTab: 'form' | 'text';

  const tabs: { id: 'form' | 'text'; label: string }[] = [
    { id: 'form', label: '📝 Form View' },
    { id: 'text', label: '📄 Text View' },
  ];
</script>

<div class="border-b border-gray-200 dark:border-gray-700 mb-4">
  <nav class="-mb-px flex space-x-4" aria-label="Tabs">
    {#each tabs as tab}
      <button
        on:click={() => (currentTab = tab.id)}
        class="whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-150
        {currentTab === tab.id
          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'}"
      >
        {tab.label}
      </button>
    {/each}
  </nav>
</div>
