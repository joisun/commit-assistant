<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  let loading = false;
  const dispatch = createEventDispatcher();

  function handleClick() {
    if (loading) return;

    loading = true;
    dispatch('click');

    // Simulate API call
    setTimeout(() => {
      loading = false;
    }, 2000); // 2-second simulation
  }
</script>

<button
  class="ai-trigger-button"
  title="Generate with AI"
  on:click={handleClick}
  disabled={loading}
>
  <span>{loading ? 'Generating...' : 'AI Generate'}</span>
</button>

<style>
  .ai-trigger-button {
    background: none;
    border: none;
    padding: 0;
    font-size: var(--vscode-font-size);
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s ease-in-out;
    color: #FF4A91;
  }

  .ai-trigger-button:hover {
    color: rgba(255, 74, 145, 0.8);
  }

  .ai-trigger-button:disabled {
    cursor: not-allowed;
    color: rgba(255, 74, 145, 0.5);
  }
</style>
