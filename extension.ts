import * as vscode from 'vscode'
import * as path from 'path'

// Define the shape of the state object
interface WebviewState {
  currentView: 'form' | 'text' | 'flags'
  commitData: any
  textContent: string
  flags: Record<string, string[]>
}

export function activate(context: vscode.ExtensionContext) {
  console.log('Commit Assistant is now active!')

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
      localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'out'))],
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
        }
      },
      null,
      this._disposables
    )

    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('commitAssistant')) {
        // Settings are handled in the settings panel now
      }
    })
  }

  private _saveCommitMessage(commitMessage: string) {
    const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports
    const git = gitExtension?.getAPI(1)

    if (git && git.repositories.length > 0) {
      const repo = git.repositories[0]
      repo.inputBox.value = commitMessage

      vscode.window.showInformationMessage('Commit message saved!')

      const config = vscode.workspace.getConfiguration('commitAssistant')
      if (config.get('saveAndClose')) {
        this._panel.dispose()
      }
    } else {
      vscode.window.showErrorMessage('No Git repository found!')
    }
  }

  private _update() {
    const webview = this._panel.webview
    this._panel.title = 'Commit Assistant'
    this._panel.webview.html = this._getHtmlForWebview(webview)

    // Send stored state to the webview
    const storedState = this._context.workspaceState.get<WebviewState>('state')
    if (storedState) {
      this._panel.webview.postMessage({ command: 'loadState', state: storedState })
    }
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
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
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
      (message) => {
        if (message.command === 'updateSetting') {
          vscode.workspace.getConfiguration('commitAssistant').update(message.key, message.value, vscode.ConfigurationTarget.Global)
        }
      },
      null,
      this._disposables
    )

    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('commitAssistant')) {
        this._sendSettings()
      }
    })
  }

  private _sendSettings() {
    const config = vscode.workspace.getConfiguration('commitAssistant')
    this._panel.webview.postMessage({
      command: 'loadSettings',
      settings: {
        defaultView: config.get('defaultView'),
        saveAndClose: config.get('saveAndClose'),
      },
    })
  }

  private _update() {
    this._panel.webview.html = this._getHtmlForWebview(this._panel.webview)
    this._sendSettings()
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    const scriptPathOnDisk = vscode.Uri.file(path.join(this._context.extensionPath, 'out', 'webview', 'settings-bundle.js'))
    const scriptUri = webview.asWebviewUri(scriptPathOnDisk)

    const stylePathOnDisk = vscode.Uri.file(path.join(this._context.extensionPath, 'out', 'webview', 'bundle.css'))
    const styleUri = webview.asWebviewUri(stylePathOnDisk)

    const nonce = getNonce()

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
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
