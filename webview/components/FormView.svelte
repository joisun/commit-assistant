<script lang="ts">
  export let commitData: {
    type: string;
    scope: string;
    description: string;
    body: string;
    footer: string;
  };

  const commitTypes = [
    { value: 'feat', label: 'feat: A new feature' },
    { value: 'fix', label: 'fix: A bug fix' },
    { value: 'docs', label: 'docs: Documentation changes' },
    { value: 'style', label: 'style: Code style changes' },
    { value: 'refactor', label: 'refactor: Code refactoring' },
    { value: 'test', label: 'test: Adding tests' },
    { value: 'chore', label: 'chore: Maintenance tasks' },
  ];

  const baseInputClasses = "w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-200";
</script>

<div class="space-y-4">
  <div>
    <label for="type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type:</label>
    <select id="type" bind:value={commitData.type} class={baseInputClasses}>
      <option value="">Select type...</option>
      {#each commitTypes as { value, label }}
        <option {value}>{label}</option>
      {/each}
    </select>
  </div>
  <div>
    <label for="scope" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Scope (optional):</label>
    <input type="text" id="scope" bind:value={commitData.scope} placeholder="e.g., auth, ui, api" class={baseInputClasses}>
  </div>
  <div>
    <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description:</label>
    <input type="text" id="description" bind:value={commitData.description} placeholder="Brief description of changes" maxlength="72" class={baseInputClasses}>
  </div>
  <div>
    <label for="body" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Body (optional):</label>
    <textarea id="body" rows="4" bind:value={commitData.body} placeholder="Detailed description of changes" class={baseInputClasses}></textarea>
  </div>
  <div>
    <label for="footer" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Footer (optional):</label>
    <textarea id="footer" rows="2" bind:value={commitData.footer} placeholder="e.g., Closes #123, Breaking change info" class={baseInputClasses}></textarea>
  </div>
</div>
