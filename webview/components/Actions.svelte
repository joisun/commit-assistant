<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
</script>

<div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
  <button
    class="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
    on:click={() => dispatch('cancel')}
  >
    Cancel
  </button>
  <button
    class="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    on:click={() => dispatch('save')}
  >
    Save Commit
  </button>
</div>
