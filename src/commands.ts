import * as vscode from 'vscode';
import { ContextStore } from './store';
import { uid } from './utils';

export async function copyContextToClipboard(store: ContextStore, ids?: string[]) {
  if (store.isEmpty()) {
    vscode.window.showWarningMessage('No context blocks to send.');
    return;
  }

  const prompt = store.toPrompt(ids);
  await vscode.env.clipboard.writeText(prompt);
  vscode.window.showInformationMessage(
    '✓ Context copied to clipboard — paste it into Claude Code (⌘V / Ctrl+V)',
    'OK'
  );
}

export async function sendToClaude(store: ContextStore, ids?: string[]) {
  if (store.isEmpty()) {
    vscode.window.showWarningMessage('No context blocks to send.');
    return;
  }

  const prompt = store.toPrompt(ids);
  const ext = vscode.extensions.getExtension('anthropic.claude-code');
  if (!ext) {
    vscode.window.showWarningMessage('Claude Code extension is not installed.');
    return;
  }

  try {
    await vscode.commands.executeCommand('claude-vscode.editor.open', undefined, prompt);
  } catch {
    vscode.window.showWarningMessage('Failed to open Claude Code panel.');
  }
}

export function registerCommands(
  context: vscode.ExtensionContext,
  store: ContextStore
) {
  context.subscriptions.push(
    vscode.commands.registerCommand('claudeContext.addAnnotation', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) { return; }
      if (editor.selection.isEmpty) {
        vscode.window.showWarningMessage('Select some code first.');
        return;
      }

      const annotationInput = await vscode.window.showInputBox({
        prompt: 'What do these lines do? (optional — press Enter to skip)',
        placeHolder: 'e.g. "JWT token validation", "Auth middleware", "DB connection pool"',
      });
      if (annotationInput === undefined) { return; } // Escape pressed

      const annotation = annotationInput.trim();
      const sel = editor.selection;
      store.add({
        id: uid(),
        annotation: annotation,
        filePath: editor.document.uri.fsPath,
        startLine: sel.start.line,
        endLine: sel.end.line,
        code: editor.document.getText(sel),
        language: editor.document.languageId
      });

      await vscode.commands.executeCommand('claudeContext.panel.focus');

      const lineCount = sel.end.line - sel.start.line + 1;
      const label = annotation || 'snippet';
      vscode.window.showInformationMessage(
        `✓ Added "${label}" (${lineCount} line${lineCount > 1 ? 's' : ''})`
      );
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('claudeContext.copyToClipboard', () => copyContextToClipboard(store))
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('claudeContext.sendToClaude', () => sendToClaude(store))
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('claudeContext.clearAll', () => {
      store.clear();
    })
  );
}
