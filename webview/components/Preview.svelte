<script lang="ts">
  export let text: string;
</script>

<div class="mt-6">
  <h3 class="text-base font-semibold mb-2">Preview</h3>
  <pre
    class="p-4 rounded-md text-sm whitespace-pre-wrap w-full min-h-[100px] font-mono"
  >{text || 'No content yet...'}</pre>
</div>

<style>
  h3 {
    color: var(--vscode-foreground);
  }
  pre {
    background-color: var(--vscode-textBlockQuote-background);
    border: 1px solid var(--vscode-textBlockQuote-border);
    color: var(--vscode-editor-foreground);
  }
</style>
