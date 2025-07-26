<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte'

  export let items: { value: string; label: string; description?: string }[] = []
  export let selectedValue: string
  export let placeholder: string = 'Select an option...'

  let isOpen = false
  const dispatch = createEventDispatcher()

  let selectElement: HTMLElement

  function toggleDropdown() {
    isOpen = !isOpen
  }

  function selectItem(value: string) {
    selectedValue = value
    dispatch('change', value)
    isOpen = false
  }

  function handleClickOutside(event: MouseEvent) {
    if (selectElement && !selectElement.contains(event.target as Node)) {
      isOpen = false
    }
  }

  onMount(() => {
    window.addEventListener('click', handleClickOutside)
  })

  onDestroy(() => {
    window.removeEventListener('click', handleClickOutside)
  })

  $: selectedLabel = items.find((item) => item.value === selectedValue)?.label || placeholder
</script>

<div class="relative custom-select-wrapper" bind:this={selectElement}>
  <button on:click={toggleDropdown} class="custom-select-button">
    <span>{selectedLabel}</span>
    <svg class="dropdown-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 11L3 6h10z" /></svg>
  </button>

  {#if isOpen}
    <div class="custom-select-options">
      {#each items as item (item.value)}
        <div class="option-item" class:selected={item.value === selectedValue} on:click={() => selectItem(item.value)} role="option" aria-selected={item.value === selectedValue}>
          <div class="option-label">{item.label}</div>
          {#if item.description}
            <div class="option-description">{item.description}</div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .custom-select-wrapper {
    margin-bottom: 1rem; /* Add spacing below the component */
  }
  .relative {
    position: relative;
  }
  .custom-select-button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background-color: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
    border: 1px solid var(--vscode-input-border);
    border-radius: 2px;
    padding: 8px; /* Increase padding */
    font-size: var(--vscode-font-size);
    text-align: left;
    cursor: pointer;
    transition: border-color 0.1s ease-in-out;
  }
  .custom-select-button:focus {
    outline: none; /* Remove default outline */
    border-color: var(--vscode-focusBorder);
  }
  .dropdown-arrow {
    width: 1em;
    height: 1em;
    fill: var(--vscode-icon-foreground);
    margin-left: 0.5rem;
  }
  .custom-select-options {
    position: absolute;
    top: calc(100% + 2px);
    left: 0;
    right: 0;
    background-color: var(--vscode-dropdown-background);
    border: 1px solid var(--vscode-focusBorder); /* Use focus color for the border */
    border-radius: 4px; /* Slightly more pronounced radius */
    padding: 4px; /* Add padding to the container */
    max-height: 200px;
    overflow-y: auto;
    z-index: 10;
  }
  .option-item {
    padding: 4px 8px;
    cursor: pointer;
    border-radius: 2px; /* Add radius to items for consistency */
    margin-bottom: 0.25rem; /* Add margin between items */
  }
  .option-item:last-child {
    margin-bottom: 0; /* Remove margin from the last item */
  }
  .option-item:hover {
    background-color: var(--vscode-list-activeSelectionBackground); /* Unify hover color */
  }
  .option-item.selected {
    background-color: var(--vscode-list-activeSelectionBackground);
    color: var(--vscode-list-activeSelectionForeground);
  }
  .option-label {
    font-weight: 500;
  }
  .option-description {
    font-size: 0.9em;
    color: var(--vscode-descriptionForeground);
    margin-top: 2px;
  }
</style>
