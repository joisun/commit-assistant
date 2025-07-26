<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Tabs from './components/Tabs.svelte';
  import FormView from './components/FormView.svelte';
  import TextView from './components/TextView.svelte';
  import Preview from './components/Preview.svelte';
  import Actions from './components/Actions.svelte';

  // @ts-ignore
  const vscode = acquireVsCodeApi();

  let currentTab: 'form' | 'text' = 'form';
  let preview = '';

  let commitData = {
    type: '',
    scope: '',
    description: '',
    body: '',
    footer: '',
  };

  let textContent = '';

  function generateCommitFromForm() {
    const { type, scope, description, body, footer } = commitData;
    if (!type || !description) return '';
    
    let message = type;
    if (scope) message += `(${scope})`;
    message += `: ${description}`;
    if (body) message += `\n\n${body}`;
    if (footer) message += `\n\n${footer}`;
    return message;
  }

  function saveCommit() {
    if (!preview.trim()) {
      vscode.postMessage({ command: 'showError', text: 'Commit message cannot be empty.' });
      return;
    }
    vscode.postMessage({ command: 'saveCommit', text: preview });
  }

  function cancel() {
    vscode.postMessage({ command: 'cancel' });
  }

  function saveState() {
    vscode.setState({ currentTab, commitData, textContent });
  }

  function loadState() {
    const state = vscode.getState();
    if (!state) return;
    currentTab = state.currentTab || 'form';
    commitData = state.commitData || commitData;
    textContent = state.textContent || '';
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
      preview = generateCommitFromForm();
    } else {
      preview = textContent;
    }
    saveState();
  }
</script>

<main class="bg-white dark:bg-gray-900 text-black dark:text-white p-4 sm:p-6 font-sans flex flex-col h-screen">
  <div class="flex-shrink-0">
    <h1 class="text-xl font-bold mb-4">🤖 Commit Assistant</h1>
    <Tabs bind:currentTab />
  </div>

  <div class="flex-grow overflow-y-auto pr-2 -mr-2">
    {#if currentTab === 'form'}
      <FormView bind:commitData />
    {:else}
      <TextView bind:value={textContent} />
    {/if}
    <Preview text={preview} />
  </div>

  <div class="flex-shrink-0 mt-4">
    <Actions on:save={saveCommit} on:cancel={cancel} />
  </div>
</main>

<style>
  /* Simple scrollbar styling for webkit browsers */
  .overflow-y-auto::-webkit-scrollbar {
    width: 6px;
  }
  .overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
  }
  .overflow-y-auto::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 20px;
    border: transparent;
  }
</style>
