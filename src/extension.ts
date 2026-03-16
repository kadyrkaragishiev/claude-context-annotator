import * as vscode from 'vscode';
import { ContextStore } from './store';
import { ContextPanelProvider } from './panel';
import { registerCommands } from './commands';

export function activate(context: vscode.ExtensionContext) {
  const store = new ContextStore();
  const provider = new ContextPanelProvider(context.extensionUri, store);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      ContextPanelProvider.viewType,
      provider,
      { webviewOptions: { retainContextWhenHidden: true } }
    )
  );

  registerCommands(context, store);
}

export function deactivate() {}
