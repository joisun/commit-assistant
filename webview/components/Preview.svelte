<script lang="ts">
  export let text: string;
</script>

<div class="mt-6">
  <h3 class="text-base font-semibold mb-2 text-gray-800 dark:text-gray-200">📋 Preview</h3>
  <pre
    class="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap w-full min-h-[100px] font-mono"
  >{text || 'No content yet...'}</pre>
</div>
