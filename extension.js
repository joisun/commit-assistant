"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
function activate(context) {
    console.log('Commit Assistant is now active!');
    const disposable = vscode.commands.registerCommand('commitAssistant.openEditor', () => {
        CommitEditorPanel.createOrShow(context.extensionPath);
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
class CommitEditorPanel {
    static createOrShow(extensionPath) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        if (CommitEditorPanel.currentPanel) {
            CommitEditorPanel.currentPanel._panel.reveal(column);
            return;
        }
        const panel = vscode.window.createWebviewPanel(CommitEditorPanel.viewType, 'Commit Assistant', column || vscode.ViewColumn.One, {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.file(path.join(extensionPath, 'webview')),
            ],
        });
        CommitEditorPanel.currentPanel = new CommitEditorPanel(panel, extensionPath);
    }
    constructor(panel, extensionPath) {
        this._disposables = [];
        this._panel = panel;
        this._extensionPath = extensionPath;
        this._update();
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
                case 'saveCommit':
                    this._saveCommitMessage(message.text);
                    return;
                case 'cancel':
                    this._panel.dispose();
                    return;
            }
        }, null, this._disposables);
    }
    _saveCommitMessage(commitMessage) {
        const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
        const git = gitExtension?.getAPI(1);
        if (git && git.repositories.length > 0) {
            const repo = git.repositories[0];
            repo.inputBox.value = commitMessage;
            vscode.window.showInformationMessage('Commit message saved!');
            const config = vscode.workspace.getConfiguration('commitAssistant');
            if (config.get('saveAndClose')) {
                this._panel.dispose();
            }
        }
        else {
            vscode.window.showErrorMessage('No Git repository found!');
        }
    }
    _update() {
        const webview = this._panel.webview;
        this._panel.title = 'Commit Assistant';
        this._panel.webview.html = this._getHtmlForWebview(webview);
    }
    _getHtmlForWebview(webview) {
        const scriptPathOnDisk = vscode.Uri.file(path.join(this._extensionPath, 'webview', 'main.js'));
        const scriptUri = webview.asWebviewUri(scriptPathOnDisk);
        const stylePathOnDisk = vscode.Uri.file(path.join(this._extensionPath, 'webview', 'main.css'));
        const styleUri = webview.asWebviewUri(stylePathOnDisk);
        const nonce = getNonce();
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="${styleUri}" rel="stylesheet">
    <title>Commit Assistant</title>
</head>
<body>
    <div class="container">
        <h1>🤖 Commit Assistant</h1>

        <div class="tab-container">
            <button class="tab-button active" onclick="showTab('form')">📝 Form View</button>
            <button class="tab-button" onclick="showTab('text')">📄 Text View</button>
        </div>

        <div id="form-tab" class="tab-content active">
            <div class="form-group">
                <label for="type">Type:</label>
                <select id="type">
                    <option value="">Select type...</option>
                    <option value="feat">feat: A new feature</option>
                    <option value="fix">fix: A bug fix</option>
                    <option value="docs">docs: Documentation changes</option>
                    <option value="style">style: Code style changes</option>
                    <option value="refactor">refactor: Code refactoring</option>
                    <option value="test">test: Adding tests</option>
                    <option value="chore">chore: Maintenance tasks</option>
                </select>
            </div>

            <div class="form-group">
                <label for="scope">Scope (optional):</label>
                <input type="text" id="scope" placeholder="e.g., auth, ui, api">
            </div>

            <div class="form-group">
                <label for="description">Description:</label>
                <input type="text" id="description" placeholder="Brief description of changes" maxlength="72">
            </div>

            <div class="form-group">
                <label for="body">Body (optional):</label>
                <textarea id="body" rows="4" placeholder="Detailed description of changes"></textarea>
            </div>

            <div class="form-group">
                <label for="footer">Footer (optional):</label>
                <textarea id="footer" rows="2" placeholder="e.g., Closes #123, Breaking change info"></textarea>
            </div>
        </div>

        <div id="text-tab" class="tab-content">
            <div class="form-group">
                <label for="commit-text">Commit Message:</label>
                <textarea id="commit-text" rows="10" placeholder="Write your commit message here..."></textarea>
            </div>
        </div>

        <div class="preview-section">
            <h3>📋 Preview:</h3>
            <pre id="preview"></pre>
        </div>

        <div class="actions">
            <button class="btn btn-primary" onclick="saveCommit()">💾 Save Commit</button>
            <button class="btn btn-secondary" onclick="cancel()">❌ Cancel</button>
            <button class="btn btn-secondary" onclick="loadTemplate()">📄 Load Template</button>
        </div>
    </div>

    <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
    }
    dispose() {
        CommitEditorPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
}
CommitEditorPanel.viewType = 'commitEditor';
function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map