<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import FlagRow from './FlagRow.svelte';
  import Plus from './icons/Plus.svelte';

  export let commitData: {
    type: string;
    scope: string;
    description: string;
    body: string;
    footer: string;
    selectedFlags: { flag: string; theme: string }[];
  };

  export let flags: Record<string, string[]> = {};

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

  function update(field: keyof Omit<typeof commitData, 'selectedFlags'>, value: string) {
    const newCommitData = { ...commitData, [field]: value };
    dispatch('change', newCommitData);
  }

  function addFlagRow() {
    commitData.selectedFlags = [...commitData.selectedFlags, { flag: '', theme: '' }];
    dispatch('change', commitData);
  }

  function handleFlagUpdate(index: number, detail: { field: 'flag' | 'theme', value: string }) {
    commitData.selectedFlags[index][detail.field] = detail.value;
    if (detail.field === 'flag') {
      commitData.selectedFlags[index].theme = '';
    }
    dispatch('change', commitData);
  }

  function handleFlagRemove(index: number) {
    commitData.selectedFlags = commitData.selectedFlags.filter((_, i) => i !== index);
    dispatch('change', commitData);
  }
</script>

<div class="space-y-4">
  <div>
    <label class="block text-sm font-medium mb-1">Flags <span class="text-gray-400">(optional)</span></label>
    <div class="space-y-2">
      {#each commitData.selectedFlags as { flag, theme }, index}
        <FlagRow
          selectedFlag={flag}
          selectedTheme={theme}
          availableFlags={flags}
          on:update={(e) => handleFlagUpdate(index, e.detail)}
          on:remove={() => handleFlagRemove(index)}
        />
      {/each}
      <button on:click={addFlagRow} class="add-flag-button">
        <Plus />
        <span>Add Flag</span>
      </button>
    </div>
  </div>
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
  input,
  select,
  textarea {
    background-color: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
    border: 1px solid var(--vscode-input-border);
    border-radius: 2px;
    padding: 4px;
    font-size: var(--vscode-font-size);
  }
  input:focus,
  select:focus,
  textarea:focus {
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
  .add-flag-button {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background: none;
    border: 1px solid var(--vscode-button-secondaryBackground);
    color: var(--vscode-button-secondaryForeground);
    padding: 2px 8px;
    border-radius: 2px;
    cursor: pointer;
    transition: background-color 0.15s ease-in-out;
  }
  .add-flag-button:hover {
    background-color: var(--vscode-button-secondaryHoverBackground);
  }
</style>
