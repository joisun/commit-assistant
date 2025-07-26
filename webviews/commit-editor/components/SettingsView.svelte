<script lang="ts">
  import { onMount } from 'svelte';

  // @ts-ignore
  const vscode = acquireVsCodeApi();

  let settings = {
    defaultView: 'form',
    saveAndClose: false,
  };

  function updateSetting(key: string, value: any) {
    vscode.postMessage({
      command: 'updateSetting',
      key,
      value,
    });
  }

  onMount(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      if (message.command === 'loadSettings') {
        settings = message.settings;
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  });
</script>

<div class="p-4 space-y-6">
  <h2 class="text-lg font-bold">Settings</h2>

  <div class="space-y-2">
    <label for="defaultView" class="block text-sm font-medium">Default View</label>
    <p class="text-sm" style="color: var(--vscode-descriptionForeground)">
      Choose the default view when opening the editor.
    </p>
    <select
      id="defaultView"
      class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      style="background-color: var(--vscode-input-background); border-color: var(--vscode-input-border);"
      bind:value={settings.defaultView}
      on:change={(e) => updateSetting('defaultView', (e.currentTarget as HTMLSelectElement).value)}
    >
      <option value="form">Form</option>
      <option value="text">Text</option>
    </select>
  </div>

  <div class="relative flex items-start">
    <div class="flex items-center h-5">
      <input
        id="saveAndClose"
        type="checkbox"
        class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
        style="background-color: var(--vscode-input-background); border-color: var(--vscode-input-border);"
        bind:checked={settings.saveAndClose}
        on:change={(e) => updateSetting('saveAndClose', (e.currentTarget as HTMLInputElement).checked)}
      />
    </div>
    <div class="ml-3 text-sm">
      <label for="saveAndClose" class="font-medium">Save and Close</label>
      <p class="text-sm" style="color: var(--vscode-descriptionForeground);">
        Automatically close the editor after saving the commit message.
      </p>
    </div>
  </div>
</div>
