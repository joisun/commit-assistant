<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
</script>

<div class="flex justify-end space-x-2 pt-3 border-t">
  <button
    class="px-3 py-1 rounded text-sm font-medium"
    on:click={() => dispatch('cancel')}
  >
    Cancel
  </button>
  <button
    class="px-2 py-1 rounded text-xs font-medium"
    on:click={() => dispatch('save')}
  >
    Save Commit
  </button>
</div>

<style>
  div {
    border-color: var(--vscode-editorWidget-border);
  }
  button {
    border: 1px solid var(--vscode-button-border, transparent);
    border-radius: 2px;
    font-size: var(--vscode-font-size);
  }
  button:focus {
    outline: 1px solid var(--vscode-focusBorder);
    outline-offset: -1px;
  }
  button:hover {
    background-color: var(--vscode-button-hoverBackground);
  }
  button:nth-of-type(1) {
    background-color: var(--vscode-button-secondaryBackground);
    color: var(--vscode-button-secondaryForeground);
  }
  button:nth-of-type(1):hover {
    background-color: var(--vscode-button-secondaryHoverBackground);
  }
  button:nth-of-type(2) {
    background-color: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
  }
</style>
