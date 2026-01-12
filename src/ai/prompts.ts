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
    return types.map((type) => type.value).join(', ')
  }
  return Object.keys(types).join(', ')
}

export function generateFormPrompt(language: string, maxLength: number, commitTypes: any, diff: string, aiFieldConfig: { scope: boolean; body: boolean; footer: boolean }, formData?: any): string {
  const types = commitTypes || conventionalCommitTypes
  let rules = []

  if (formData && formData.type && formData.type !== 'auto') {
    rules.push(`**type**: You must use the type "${formData.type}". Do not change it.`)
  } else {
    rules.push(`**type**: Choose the most appropriate type from this list: ${getTypeNames(types)}.`)
  }
  
  rules.push(`**description**: Write a concise summary of the changes. The description must be a maximum of ${maxLength} characters.`)

  if (aiFieldConfig.scope) {
    rules.push('**scope**: (Optional) Identify a short noun describing the section of the codebase the changes apply to.')
  } else {
    rules.push('Do not generate a `scope` field.')
  }

  if (aiFieldConfig.body) {
    rules.push('**body**: (Optional) Provide a more detailed explanation of the changes.')
  } else {
    rules.push('Do not generate a `body` field.')
  }

  if (aiFieldConfig.footer) {
    rules.push('**footer**: (Optional) Reference any related issues or breaking changes.')
  } else {
    rules.push('Do not generate a `footer` field.')
  }

  rules.push('All fields must be strings.')

  return `
As an expert programmer, please generate a structured commit message in ${language} based on the following code changes (diff).

${diff}

The output must be a valid JSON object.

Rules:
${rules.map((rule, i) => `${i + 1}. ${rule}`).join('\n')}
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
3.  The commit message description (the part after the type and scope) must be a maximum of ${maxLength} characters.
4.  Do not include any explanations or markdown formatting. Your entire response will be passed directly into git commit.
`.trim()
}
