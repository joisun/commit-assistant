const conventionalCommitTypes = {
  docs: 'Documentation only changes',
  style: 'Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
  refactor: 'A code change that neither fixes a bug nor adds a feature',
  perf: 'A code change that improves performance',
  test: 'Adding missing tests or correcting existing tests',
  build: 'Changes that affect the build system or external dependencies',
  ci: 'Changes to our CI configuration files and scripts',
  chore: "Other changes that don't modify src or test files",
  revert: 'Reverts a previous commit',
  feat: 'A new feature',
  fix: 'A bug fix',
}

function getTypeNames(types: any): string {
  if (Array.isArray(types)) {
    // Handle the array of objects from VS Code config
    return types.map((type) => type.value).join(', ')
  }
  // Handle the fallback object
  return Object.keys(types).join(', ')
}

export function generateFormPrompt(language: string, maxLength: number, commitTypes: any, diff: string): string {
  const types = commitTypes || conventionalCommitTypes
  return `
As an expert programmer, please generate a structured commit message in ${language} based on the following code changes (diff).

${diff}

The output must be a valid JSON object with the following structure:
{
  "type": "<type>",
  "scope": "<scope>",
  "description": "<description>",
  "body": "<body>",
  "footer": "<footer>"
}

Rules:
1.  **type**: Choose the most appropriate type from this list: ${getTypeNames(types)}.
2.  **scope**: (Optional) Identify a short noun describing the section of the codebase the changes apply to.
3.  **description**: Write a concise summary of the changes, no more than ${maxLength} characters.
4.  **body**: (Optional) Provide a more detailed explanation of the changes.
5.  **footer**: (Optional) Reference any related issues or breaking changes.
6.  All fields must be strings.
`.trim()
}

export function generateTextPrompt(language: string, maxLength: number, diff: string, commitTypes: any): string {
  const types = commitTypes || conventionalCommitTypes
  return `
As an expert programmer, please write a concise and clear commit message in ${language} based on the following code changes (diff).

${diff}

Rules:
1.  The message must follow the conventional commit format.
2.  Choose the most appropriate commit type from this list: ${getTypeNames(types)}.
3.  The entire commit message (header, body, footer) should be no more than ${maxLength} characters in total.
4.  Do not include any explanations or markdown formatting. Your entire response will be passed directly into git commit.
`.trim()
}
