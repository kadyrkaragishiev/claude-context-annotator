import * as vscode from 'vscode';
import * as path from 'path';

export function getRelPath(filePath: string): string {
  const folders = vscode.workspace.workspaceFolders;
  return folders ? path.relative(folders[0].uri.fsPath, filePath) : path.basename(filePath);
}

export function navigateTo(filePath: string, startLine: number, endLine: number) {
  const uri = vscode.Uri.file(filePath);
  vscode.window.showTextDocument(uri, {
    selection: new vscode.Range(startLine, 0, endLine, 999),
    preserveFocus: false
  });
}

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function escHtml(s: string): string {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

export function nonce(): string {
  let s = '';
  const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) { s += c[Math.floor(Math.random() * c.length)]; }
  return s;
}
