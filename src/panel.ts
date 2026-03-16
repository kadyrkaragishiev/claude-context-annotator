import * as vscode from 'vscode';
import { ContextStore } from './store';
import { buildHtml } from './webview';
import { navigateTo } from './utils';
import { copyContextToClipboard, sendToClaude } from './commands';

export class ContextPanelProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'claudeContext.panel';
  private view?: vscode.WebviewView;

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly store: ContextStore
  ) {
    store.onChange(() => this.refresh());
  }

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _ctx: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this.view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri]
    };
    this.refresh();

    webviewView.webview.onDidReceiveMessage(msg => {
      if (msg.type === 'remove')        { this.store.remove(msg.id); }
      if (msg.type === 'clear')         { this.store.clear(); }
      if (msg.type === 'copy')          { copyContextToClipboard(this.store, msg.ids); }
      if (msg.type === 'sendToClaude')  { sendToClaude(this.store, msg.ids); }
      if (msg.type === 'navigate')      { navigateTo(msg.filePath, msg.startLine, msg.endLine); }
    });
  }

  refresh() {
    if (this.view) {
      this.view.webview.html = buildHtml(this.store.getAll());
    }
  }
}
