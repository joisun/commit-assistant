<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  // VS Code API
  // @ts-ignore
  const vscode = acquireVsCodeApi();

  let currentTab: 'form' | 'text' = 'form';

  const commitData = {
    type: '',
    scope: '',
    description: '',
    body: '',
    footer: '',
  };

  let textContent = '';
  let preview = '';

  const commitTypes = [
    { value: 'feat', label: 'feat: A new feature' },
    { value: 'fix', label: 'fix: A bug fix' },
    { value: 'docs', label: 'docs: Documentation changes' },
    { value: 'style', label: 'style: Code style changes' },
    { value: 'refactor', label: 'refactor: Code refactoring' },
    { value: 'test', label: 'test: Adding tests' },
    { value: 'chore', label: 'chore: Maintenance tasks' },
  ];

  function updatePreview() {
    if (currentTab === 'form') {
      const { type, scope, description, body, footer } = commitData;
      if (!type || !description) {
        preview = '';
        return;
      }
      let message = type;
      if (scope) {
        message += `(${scope})`;
      }
      message += `: ${description}`;
      if (body) {
        message += `\n\n${body}`;
      }
      if (footer) {
        message += `\n\n${footer}`;
      }
      preview = message;
    } else {
      preview = textContent;
    }
  }

  function saveCommit() {
    if (!preview.trim()) {
      // In a real shadcn setup, we'd use a Toast component here
      alert('Please enter a commit message');
      return;
    }
    vscode.postMessage({ command: 'saveCommit', text: preview });
  }

  function cancel() {
    vscode.postMessage({ command: 'cancel' });
  }

  function saveState() {
    const state = {
      currentTab,
      formData: commitData,
      textContent,
    };
    vscode.setState(state);
  }

  function loadState() {
    const state = vscode.getState();
    if (!state) return;

    currentTab = state.currentTab || 'form';
    Object.assign(commitData, state.formData);
    textContent = state.textContent || '';
    updatePreview();
  }

  function handleKeydown(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      saveCommit();
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      cancel();
    }
  }

  onMount(() => {
    loadState();
    window.addEventListener('beforeunload', saveState);
    document.addEventListener('keydown', handleKeydown);
  });

  onDestroy(() => {
    window.removeEventListener('beforeunload', saveState);
    document.removeEventListener('keydown', handleKeydown);
  });

  $: {
    if (currentTab === 'form') {
      updatePreview();
    }
  }
  $: updatePreview();

</script>

<main class="bg-background text-foreground p-4 font-sans">
  <div class="container mx-auto">
    <h1 class="text-2xl font-bold mb-4">🤖 Commit Assistant</h1>

    <div class="flex border-b mb-4">
      <button
        class="py-2 px-4 -mb-px {currentTab === 'form' ? 'border-b-2 border-blue-500' : ''}"
        on:click={() => currentTab = 'form'}>
        📝 Form View
      </button>
      <button
        class="py-2 px-4 -mb-px {currentTab === 'text' ? 'border-b-2 border-blue-500' : ''}"
        on:click={() => currentTab = 'text'}>
        📄 Text View
      </button>
    </div>

    {#if currentTab === 'form'}
      <div class="space-y-4">
        <div>
          <label for="type" class="block text-sm font-medium mb-1">Type:</label>
          <select id="type" bind:value={commitData.type} class="w-full p-2 border rounded">
            <option value="">Select type...</option>
            {#each commitTypes as { value, label }}
              <option {value}>{label}</option>
            {/each}
          </select>
        </div>
        <div>
          <label for="scope" class="block text-sm font-medium mb-1">Scope (optional):</label>
          <input type="text" id="scope" bind:value={commitData.scope} placeholder="e.g., auth, ui, api" class="w-full p-2 border rounded">
        </div>
        <div>
          <label for="description" class="block text-sm font-medium mb-1">Description:</label>
          <input type="text" id="description" bind:value={commitData.description} placeholder="Brief description of changes" maxlength="72" class="w-full p-2 border rounded">
        </div>
        <div>
          <label for="body" class="block text-sm font-medium mb-1">Body (optional):</label>
          <textarea id="body" rows="4" bind:value={commitData.body} placeholder="Detailed description of changes" class="w-full p-2 border rounded"></textarea>
        </div>
        <div>
          <label for="footer" class="block text-sm font-medium mb-1">Footer (optional):</label>
          <textarea id="footer" rows="2" bind:value={commitData.footer} placeholder="e.g., Closes #123, Breaking change info" class="w-full p-2 border rounded"></textarea>
        </div>
      </div>
    {:else}
      <div>
        <label for="commit-text" class="block text-sm font-medium mb-1">Commit Message:</label>
        <textarea id="commit-text" rows="10" bind:value={textContent} placeholder="Write your commit message here..." class="w-full p-2 border rounded"></textarea>
      </div>
    {/if}

    <div class="mt-6">
      <h3 class="text-lg font-semibold mb-2">📋 Preview:</h3>
      <pre class="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">{preview || 'No content yet...'}</pre>
    </div>

    <div class="flex justify-end space-x-2 mt-6">
      <button class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" on:click={cancel}>❌ Cancel</button>
      <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" on:click={saveCommit}>💾 Save Commit</button>
    </div>
  </div>
</main>
