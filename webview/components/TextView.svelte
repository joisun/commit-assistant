<script lang="ts">
  export let value: string;
</script>

<div>
  <label for="commit-text" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Commit Message:</label>
  <textarea
    id="commit-text"
    rows="10"
    bind:value
    placeholder="Write your commit message here..."
    class="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-200"
  ></textarea>
</div>
