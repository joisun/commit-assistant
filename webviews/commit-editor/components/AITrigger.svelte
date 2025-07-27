<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte'

  export let disabled = false
  export let loading = false // Now controlled by parent

  const dispatch = createEventDispatcher()

  let loadingText = 'Generating'
  let intervalId: any

  function startLoadingAnimation() {
    let dots = 1
    intervalId = setInterval(() => {
      loadingText = 'Generating' + '.'.repeat(dots)
      dots = (dots % 3) + 1
    }, 300)
  }

  function stopLoadingAnimation() {
    clearInterval(intervalId)
    loadingText = 'Generating'
  }

  function handleClick() {
    if (loading || disabled) return
    dispatch('click')
  }

  $: {
    if (loading) {
      startLoadingAnimation()
    } else {
      stopLoadingAnimation()
    }
  }

  onDestroy(() => {
    stopLoadingAnimation()
  })
</script>

<button class="ai-trigger-button" title="Generate with AI" on:click={handleClick} disabled={loading || disabled}>
  <span class="text-container">{loading ? loadingText : 'AI Generate'}</span>
</button>

<style>
  .text-container {
    display: inline-block;
    min-width: 90px; /* Adjust as needed */
    text-align: left;
  }

  .ai-trigger-button {
    background: none;
    border: none;
    padding: 0;
    font-size: var(--vscode-font-size);
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s ease-in-out;
    color: #ff4a91;
  }

  .ai-trigger-button:hover {
    color: rgba(255, 74, 145, 0.8);
  }

  .ai-trigger-button:disabled {
    cursor: not-allowed;
    color: rgba(255, 74, 145, 0.5);
  }
</style>
