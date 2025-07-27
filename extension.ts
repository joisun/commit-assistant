import * as vscode from 'vscode'
import * as path from 'path'
import { getAvailableModels, generateCommitMessage, generateStructuredCommitMessage } from './src/ai/ai-service'
import { Logger } from './src/utils/logger'
import { simpleGit } from 'simple-git'

// Define the shape of the state object
interface WebviewState {
  currentView: 'form' | 'text' | 'flags'
  commitData: any
  textContent: string
  flags: Record<string, string[]>
}

// New interfaces for our settings structure
interface ProviderSettings {
  apiKey: string
  model: string
  baseUrl?: string
}

interface AllSettings {
  activeProvider: string
  language: 'en' | 'zh'
  maxLength: number
  debug: boolean
  providers: {
    [key: string]: ProviderSettings
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log('Commit Assistant is now active!')
  Logger.initialize()

  context.subscriptions.push(
    vscode.commands.registerCommand('commitAssistant.openEditor', () => {
      CommitEditorPanel.createOrShow(context)
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('commitAssistant.openSettings', () => {
      SettingsPanel.createOrShow(context)
    })
  )
}

class CommitEditorPanel {
  public static currentPanel: CommitEditorPanel | undefined
  public static readonly viewType = 'commitEditor'

  private readonly _panel: vscode.WebviewPanel
  private readonly _context: vscode.ExtensionContext
  private _disposables: vscode.Disposable[] = []

  public static createOrShow(context: vscode.ExtensionContext) {
    const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined

    if (CommitEditorPanel.currentPanel) {
      CommitEditorPanel.currentPanel._panel.reveal(column)
      return
    }

    const panel = vscode.window.createWebviewPanel(CommitEditorPanel.viewType, 'Commit Assistant', column || vscode.ViewColumn.One, {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'out', 'webview'))],
    })

    CommitEditorPanel.currentPanel = new CommitEditorPanel(panel, context)
  }

  private constructor(panel: vscode.WebviewPanel, context: vscode.ExtensionContext) {
    this._panel = panel
    this._context = context

    this._update()

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables)

    this._panel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case 'saveCommit':
            this._saveCommitMessage(message.text)
            return
          case 'cancel':
            this._panel.dispose()
            return
          case 'showError':
            vscode.window.showErrorMessage(message.text)
            return
          case 'saveState':
            this._context.workspaceState.update('state', message.state)
            return
          case 'openSettings':
            vscode.commands.executeCommand('commitAssistant.openSettings')
            return
          case 'generateAiCommitForText':
            this._generateAiCommitForText()
            return
          case 'generateAiCommitForForm':
            this._generateAiCommitForForm()
            return
        }
      },
      null,
      this._disposables
    )
  }

  private _saveCommitMessage(commitMessage: string) {
    const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports
    const git = gitExtension?.getAPI(1)

    if (git && git.repositories.length > 0) {
      const repo = git.repositories[0]
      repo.inputBox.value = commitMessage

      vscode.window.showInformationMessage('Commit message saved!')

      this._panel.dispose()
    } else {
      vscode.window.showErrorMessage('No Git repository found!')
    }
  }

  private async _generateAiCommitForText() {
    Logger.info('Generating commit message for text view...')
    try {
      if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
        vscode.window.showErrorMessage('No workspace folder found. Please open a Git repository.')
        return
      }
      const workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath
      const git = simpleGit(workspacePath)

      const diff = await git.diff(['--staged'])

      if (!diff) {
        vscode.window.showErrorMessage('No staged changes found to generate a commit message.')
        return
      }

      Logger.debug('Staged Changes', diff)

      const settings = this._context.globalState.get<AllSettings>('aiSettings')

      if (!settings || !settings.activeProvider || !settings.providers[settings.activeProvider]?.apiKey) {
        vscode.window.showErrorMessage('AI settings are not configured. Please configure them in the settings.')
        return
      }

      const providerSettings = settings.providers[settings.activeProvider]

      const result = await generateCommitMessage(settings.activeProvider, providerSettings.apiKey, providerSettings.model, settings.language, settings.maxLength, diff, providerSettings.baseUrl)

      this._panel.webview.postMessage({ command: 'aiStart' })
      for await (const delta of result.textStream) {
        this._panel.webview.postMessage({ command: 'aiChunk', chunk: delta })
        Logger.debugToOutputChannel('AI Response Chunk', delta, settings)
      }
      this._panel.webview.postMessage({ command: 'aiEnd' })
    } catch (error: any) {
      vscode.window.showErrorMessage(`Error generating commit message: ${error.message}`)
      this._panel.webview.postMessage({ command: 'aiError' })
    }
  }

  private async _generateAiCommitForForm() {
    Logger.info('Generating commit message for form view...')
    try {
      if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
        vscode.window.showErrorMessage('No workspace folder found. Please open a Git repository.')
        return
      }
      const workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath
      const git = simpleGit(workspacePath)

      const diff = await git.diff(['--staged'])

      if (!diff) {
        vscode.window.showErrorMessage('No staged changes found to generate a commit message.')
        return
      }

      Logger.debug('Staged Changes', diff)

      const settings = this._context.globalState.get<AllSettings>('aiSettings')
      const config = vscode.workspace.getConfiguration('commitAssistant')
      const commitTypes = config.get('commitTypes')

      if (!settings || !settings.activeProvider || !settings.providers[settings.activeProvider]?.apiKey) {
        vscode.window.showErrorMessage('AI settings are not configured. Please configure them in the settings.')
        return
      }

      const providerSettings = settings.providers[settings.activeProvider]

      this._panel.webview.postMessage({ command: 'aiStart' })
      const result = await generateStructuredCommitMessage(
        settings.activeProvider,
        providerSettings.apiKey,
        providerSettings.model,
        settings.language,
        settings.maxLength,
        diff,
        commitTypes,
        providerSettings.baseUrl
      )
      this._panel.webview.postMessage({ command: 'loadAiFormData', data: result })
      Logger.debugToOutputChannel('AI Response Form Data', result, settings)
    } catch (error: any) {
      vscode.window.showErrorMessage(`Error generating commit message: ${error.message}`)
      this._panel.webview.postMessage({ command: 'aiError' })
    } finally {
      this._panel.webview.postMessage({ command: 'aiEnd' })
    }
  }

  private _update() {
    const webview = this._panel.webview
    this._panel.title = 'Commit Assistant'
    this._panel.webview.html = this._getHtmlForWebview(webview)

    this._sendConfig()

    // Send stored state to the webview
    const storedState = this._context.workspaceState.get<WebviewState>('state')
    if (storedState) {
      this._panel.webview.postMessage({ command: 'loadState', state: storedState })
    }
  }

  private _sendConfig() {
    const config = vscode.workspace.getConfiguration('commitAssistant')
    const commitTypes = config.get('commitTypes')
    // We could also get flags from config in the future
    this._panel.webview.postMessage({
      command: 'loadConfig',
      config: {
        commitTypes,
        flags: {}, // Placeholder for future flag configuration
      },
    })
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    const scriptPathOnDisk = vscode.Uri.file(path.join(this._context.extensionPath, 'out', 'webview', 'bundle.js'))
    const scriptUri = webview.asWebviewUri(scriptPathOnDisk)

    const stylePathOnDisk = vscode.Uri.file(path.join(this._context.extensionPath, 'out', 'webview', 'bundle.css'))
    const styleUri = webview.asWebviewUri(stylePathOnDisk)

    const nonce = getNonce()

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; img-src ${webview.cspSource} data:; script-src 'nonce-${nonce}';">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="${styleUri}" rel="stylesheet">
    <title>Commit Assistant</title>
</head>
<body>
    <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`
  }

  public dispose() {
    CommitEditorPanel.currentPanel = undefined

    this._panel.dispose()

    while (this._disposables.length) {
      const x = this._disposables.pop()
      if (x) {
        x.dispose()
      }
    }
  }
}

class SettingsPanel {
  public static currentPanel: SettingsPanel | undefined
  public static readonly viewType = 'commitAssistantSettings'

  private readonly _panel: vscode.WebviewPanel
  private readonly _context: vscode.ExtensionContext
  private _disposables: vscode.Disposable[] = []

  public static createOrShow(context: vscode.ExtensionContext) {
    const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined

    if (SettingsPanel.currentPanel) {
      SettingsPanel.currentPanel._panel.reveal(column)
      return
    }

    const panel = vscode.window.createWebviewPanel(SettingsPanel.viewType, 'Commit Assistant Settings', column || vscode.ViewColumn.One, {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'out', 'webview'))],
    })

    SettingsPanel.currentPanel = new SettingsPanel(panel, context)
  }

  private constructor(panel: vscode.WebviewPanel, context: vscode.ExtensionContext) {
    this._panel = panel
    this._context = context

    this._update()

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables)

    this._panel.webview.onDidReceiveMessage(
      async (message) => {
        switch (message.command) {
          case 'saveAiSettings':
            await this._context.globalState.update('aiSettings', message.settings)
            vscode.window.showInformationMessage('AI settings saved successfully!')
            return
          case 'getModels':
            try {
              const models = await getAvailableModels(message.provider, message.apiKey, message.baseUrl)
              this._panel.webview.postMessage({
                command: 'loadModels',
                models: models,
              })
            } catch (error: any) {
              vscode.window.showErrorMessage(`Failed to fetch AI models: ${error.message}`)
              this._panel.webview.postMessage({
                command: 'loadModelsError',
                error: error.message,
              })
            }
            return
          case 'requestInitialSettings':
            this._sendAllSettings()
            return
        }
      },
      null,
      this._disposables
    )
  }

  private _sendAllSettings() {
    const storedSettings = this._context.globalState.get<AllSettings>('aiSettings')

    this._panel.webview.postMessage({
      command: 'loadSettings',
      settings: storedSettings, // Send stored settings directly
    })
  }

  private _sendSettings() {
    // This function is no longer needed as we are not listening to configuration changes.
  }

  private _update() {
    this._panel.webview.html = this._getHtmlForWebview(this._panel.webview)
    this._sendAllSettings()
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._context.extensionUri, 'out', 'webview', 'settings-bundle.js'))
    const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this._context.extensionUri, 'out', 'webview', 'settings-bundle.css'))

    const nonce = getNonce()

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; img-src ${webview.cspSource} data:; script-src 'nonce-${nonce}';">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="${styleUri}" rel="stylesheet">
    <title>Commit Assistant Settings</title>
</head>
<body>
    <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`
  }

  public dispose() {
    SettingsPanel.currentPanel = undefined
    this._panel.dispose()
    while (this._disposables.length) {
      const x = this._disposables.pop()
      if (x) {
        x.dispose()
      }
    }
  }
}

function getNonce() {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

export function deactivate() {}
