<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let commitData: {
    type: string;
    scope: string;
    description: string;
    body: string;
    footer: string;
  };

  const dispatch = createEventDispatcher();

  const commitTypes = [
    { value: 'feat', label: 'feat: A new feature' },
    { value: 'fix', label: 'fix: A bug fix' },
    { value: 'docs', label: 'docs: Documentation changes' },
    { value: 'style', label: 'style: Code style changes' },
    { value: 'refactor', label: 'refactor: Code refactoring' },
    { value: 'test', label: 'test: Adding tests' },
    { value: 'chore', label: 'chore: Maintenance tasks' },
  ];

  function update(field: keyof typeof commitData, value: string) {
    dispatch('change', { ...commitData, [field]: value });
  }
</script>

<div class="space-y-4">
  <div>
    <label for="type" class="block text-sm font-medium mb-1">Type</label>
    <select
      id="type"
      class="w-full"
      value={commitData.type}
      on:change={(e) => update('type', e.currentTarget.value)}
    >
      <option value="">Select type...</option>
      {#each commitTypes as { value, label }}
        <option {value}>{label}</option>
      {/each}
    </select>
  </div>
  <div>
    <label for="scope" class="block text-sm font-medium mb-1">Scope <span class="text-gray-400">(optional)</span></label>
    <input
      type="text"
      id="scope"
      class="w-full"
      value={commitData.scope}
      on:input={(e) => update('scope', e.currentTarget.value)}
      placeholder="e.g., auth, ui, api"
    >
  </div>
  <div>
    <label for="description" class="block text-sm font-medium mb-1">Description</label>
    <input
      type="text"
      id="description"
      class="w-full"
      value={commitData.description}
      on:input={(e) => update('description', e.currentTarget.value)}
      placeholder="Brief description of changes"
      maxlength="72"
    >
  </div>
  <div>
    <label for="body" class="block text-sm font-medium mb-1">Body <span class="text-gray-400">(optional)</span></label>
    <textarea
      id="body"
      rows="4"
      class="w-full"
      value={commitData.body}
      on:input={(e) => update('body', e.currentTarget.value)}
      placeholder="Detailed description of changes"
    ></textarea>
  </div>
  <div>
    <label for="footer" class="block text-sm font-medium mb-1">Footer <span class="text-gray-400">(optional)</span></label>
    <textarea
      id="footer"
      rows="2"
      class="w-full"
      value={commitData.footer}
      on:input={(e) => update('footer', e.currentTarget.value)}
      placeholder="e.g., Closes #123, Breaking change info"
    ></textarea>
  </div>
</div>

<style>
  label {
    color: var(--vscode-foreground);
  }
  input, select, textarea {
    background-color: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
    border: 1px solid var(--vscode-input-border);
    border-radius: 2px;
    padding: 4px;
    font-size: var(--vscode-font-size);
  }
  input:focus, select:focus, textarea:focus {
    outline: 1px solid var(--vscode-focusBorder);
    outline-offset: -1px;
  }
  select {
    -webkit-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23${'var(--vscode-icon-foreground)'.replace('#', '')}' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    background-size: 1em;
    padding-right: 2rem;
  }
</style>
