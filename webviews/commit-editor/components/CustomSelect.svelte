<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte'

    export let items: { value: string; label: string; description?: string }[] = []

    export let selectedValue: string

    export let placeholder: string = 'Select an option...'

    export let loading = false;

    export let preference: { loadingEffect: string };

    export let selectedType: string;

  

    let isOpen = false

    const dispatch = createEventDispatcher()

  

    let selectElement: HTMLElement

    let hoveredOptionDescription: string | undefined;

    $: selectedItemDescription = items.find(item => item.value === selectedValue)?.description;

  

  

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

    <button on:click={toggleDropdown} class="custom-select-button" class:creative-loading={loading && preference?.loadingEffect === 'creative' && selectedType === 'auto'}>

      <span>{selectedLabel}</span>

      <svg class="dropdown-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 11L3 6h10z" /></svg>

    </button>

  

      {#if isOpen}

  

        <div class="custom-select-options">

  

          {#each items as item (item.value)}

  

            <div class="option-item"

  

                 class:selected={item.value === selectedValue}

  

                 on:click={() => selectItem(item.value)}

  

                 on:keydown={(e) => e.key === 'Enter' && selectItem(item.value)}

  

                 on:mouseenter={() => hoveredOptionDescription = item.description}

  

                 on:mouseleave={() => hoveredOptionDescription = undefined}

  

                 role="option"

  

                 tabindex="0"

  

                 aria-selected={item.value === selectedValue}>

  

              <div class="option-label">{item.label}</div>

  

            </div>

  

          {/each}

  

          {#if hoveredOptionDescription || selectedItemDescription}

  

            <div class="inline-description-display">

  

              {hoveredOptionDescription || selectedItemDescription}

  

            </div>

  

          {/if}

  

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

  

        padding: 4px; /* Changed from 8px to 4px for height consistency */

  

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

  

        display: flex; /* Make options horizontal */

  

        flex-wrap: wrap; /* Allow options to wrap to next line */

  

        gap: 0.25rem; /* Space between items */

  

      }

  

      .option-item {

  

        padding: 2px 6px; /* Adjusted padding for inline look */

  

        cursor: pointer;

  

        border-radius: 2px; /* Add radius to items for consistency */

  

        flex-shrink: 0; /* Prevent items from shrinking */

  

        background-color: var(--vscode-editorGroupHeader-tabsBackground); /* Subtle background for items */

  

        border: 1px solid transparent; /* default border */

  

      }

  

      .option-item:hover {

  

        background-color: var(--vscode-list-activeSelectionBackground); /* Unify hover color */

  

        border-color: var(--vscode-list-activeSelectionBackground);

  

      }

  

      .option-item.selected {

  

        background-color: var(--vscode-list-activeSelectionBackground);

  

        color: var(--vscode-list-activeSelectionForeground);

  

        border-color: var(--vscode-focusBorder); /* Highlight selected item */

  

      }

  

      .option-label {

  

        font-weight: 400; /* Lighter font weight */

  

      }

  

      .option-description {

  

        display: none; /* Hide description in inline layout */

  

      }

  

    

  

      .inline-description-display {

  

        width: 100%; /* Take full width within options container */

  

        padding: 4px 8px; /* Subtle padding */

  

        font-size: 0.8em; /* Smaller text */

  

        color: var(--vscode-descriptionForeground);

  

        background-color: var(--vscode-editor-background); /* A slightly different background */

  

        border-top: 1px solid var(--vscode-input-border); /* Separator line, not a full border */

  

        margin-top: 0.25rem; /* Small space above it */

  

      }

  

    

  

      /* Creative loading animation styles */

  

      .creative-loading {

  

        background: linear-gradient(

  

          to right,

  

          rgba(52, 211, 153, 0.15) 0%,    /* Emerald */

  

          rgba(59, 130, 246, 0.15) 25%,   /* Blue */

  

          rgba(139, 92, 246, 0.15) 50%,   /* Violet */

  

          rgba(236, 72, 153, 0.15) 75%,   /* Pink */

  

          rgba(52, 211, 153, 0.15) 100%   /* Emerald - smooth cycle */

  

        );

  

        background-size: 200% 100%;

  

        animation: elegant-flow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;

  

        border-radius: 4px;

  

        box-shadow: inset 0 0 20px rgba(52, 211, 153, 0.1);

  

      }

  

    

  

      @keyframes elegant-flow {

  

        0% {

  

          background-position: 0% 0;

  

        }

  

        50% {

  

          background-position: 100% 0;

  

        }

  

        100% {

  

          background-position: 0% 0;

  

        }

  

      }

  

    </style>
