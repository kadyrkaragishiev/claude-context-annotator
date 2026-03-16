import { AnnotatedBlock } from './types';
import { getRelPath, escHtml, nonce } from './utils';

export function buildHtml(blocks: AnnotatedBlock[]): string {
  const n = nonce();
  const count = blocks.length;

  const blocksHtml = count === 0
    ? `<div class="empty">
         <div class="empty-glyph">◈</div>
         <p>No context blocks yet</p>
         <p class="hint">Select code in any file, then<br>
           right-click → <strong>Add to Claude Context</strong><br>
           or press <kbd>⌘⇧A</kbd> / <kbd>Ctrl+Shift+A</kbd>
         </p>
       </div>`
    : blocks.map(b => {
        const rel = escHtml(getRelPath(b.filePath));
        const lines = `${b.startLine + 1}–${b.endLine + 1}`;
        const ann = escHtml(b.annotation || `${rel} L${lines}`);
        const code = escHtml(b.code);
        return `
        <div class="block" data-id="${b.id}">
          <div class="block-top">
            <input type="checkbox" class="block-check" data-id="${b.id}" checked title="Include in send">
            <span class="annotation" title="${ann}">${ann}</span>
            <button class="rm" data-remove="${b.id}" title="Remove block">✕</button>
          </div>
          <div class="block-loc" data-nav-file="${escHtml(b.filePath)}" data-nav-start="${b.startLine}" data-nav-end="${b.endLine}" title="Jump to code">
            <span class="loc-file">${rel}</span>
            <span class="loc-lines">L${lines}</span>
          </div>
          <pre class="block-code"><code>${code}</code></pre>
        </div>`;
      }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy"
  content="default-src 'none'; style-src 'nonce-${n}'; script-src 'nonce-${n}';">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style nonce="${n}">
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--vscode-font-family);
  font-size: var(--vscode-font-size);
  color: var(--vscode-foreground);
  background: var(--vscode-sideBar-background);
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* ── header bar ── */
.bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  background: var(--vscode-sideBarSectionHeader-background);
  border-bottom: 1px solid var(--vscode-sideBarSectionHeader-border,
                                var(--vscode-widget-border));
  flex-shrink: 0;
}
.bar-title {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--vscode-sideBarTitle-foreground);
  flex: 1;
}
.badge {
  font-size: 10px;
  font-weight: 600;
  background: var(--vscode-badge-background);
  color: var(--vscode-badge-foreground);
  border-radius: 10px;
  padding: 1px 6px;
  min-width: 18px;
  text-align: center;
}
.btn-sm {
  font-size: 10.5px;
  font-family: var(--vscode-font-family);
  padding: 2px 7px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid var(--vscode-button-border, transparent);
  transition: opacity .1s;
}
.btn-sm:hover { opacity: .8; }
.btn-ghost {
  background: transparent;
  color: var(--vscode-descriptionForeground);
  border-color: var(--vscode-widget-border);
}

/* ── scroll area ── */
.scroll {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

/* ── empty state ── */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 100%;
  text-align: center;
  padding: 24px 16px;
  color: var(--vscode-descriptionForeground);
}
.empty-glyph { font-size: 28px; opacity: .25; margin-bottom: 2px; }
.empty p { font-size: 11.5px; line-height: 1.6; }
.empty .hint { font-size: 10.5px; opacity: .7; }
.empty kbd {
  background: var(--vscode-keybindingLabel-background);
  border: 1px solid var(--vscode-keybindingLabel-border);
  border-radius: 3px;
  padding: 0 4px;
  font-size: 10px;
}

/* ── block card ── */
.block {
  background: var(--vscode-editor-background);
  border: 1px solid var(--vscode-widget-border);
  border-radius: 5px;
  overflow: hidden;
  transition: border-color .15s;
}
.block:hover { border-color: var(--vscode-focusBorder); }

.block-top {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  background: var(--vscode-editor-lineHighlightBackground, rgba(255,255,255,.04));
  border-bottom: 1px solid var(--vscode-widget-border);
}
.block-check {
  flex-shrink: 0;
  cursor: pointer;
  accent-color: var(--vscode-button-background);
}
.block.excluded {
  opacity: .45;
}
.annotation {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--vscode-symbolIcon-functionForeground, var(--vscode-foreground));
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rm {
  background: transparent;
  border: none;
  color: var(--vscode-descriptionForeground);
  cursor: pointer;
  font-size: 10px;
  padding: 2px 4px;
  border-radius: 3px;
  line-height: 1;
  flex-shrink: 0;
}
.rm:hover {
  background: var(--vscode-list-hoverBackground);
  color: var(--vscode-errorForeground);
}

.block-loc {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px 8px;
  cursor: pointer;
  border-bottom: 1px solid var(--vscode-widget-border);
  gap: 6px;
}
.block-loc:hover { background: var(--vscode-list-hoverBackground); }

.loc-file {
  font-size: 10px;
  font-family: var(--vscode-editor-font-family);
  color: var(--vscode-textLink-foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.loc-lines {
  font-size: 10px;
  color: var(--vscode-descriptionForeground);
  white-space: nowrap;
  flex-shrink: 0;
}

.block-code {
  padding: 7px 8px;
  font-family: var(--vscode-editor-font-family);
  font-size: calc(var(--vscode-editor-font-size, 13px) - 1px);
  color: var(--vscode-editor-foreground);
  overflow-x: auto;
  max-height: 160px;
  overflow-y: auto;
  white-space: pre;
  line-height: 1.45;
}

/* ── footer buttons ── */
.footer {
  padding: 8px;
  border-top: 1px solid var(--vscode-sideBarSectionHeader-border,
                              var(--vscode-widget-border));
  background: var(--vscode-sideBarSectionHeader-background);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.btn-send {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 0;
  font-size: 12px;
  font-weight: 600;
  font-family: var(--vscode-font-family);
  border-radius: 5px;
  cursor: pointer;
  transition: opacity .15s;
  border: none;
}
.btn-send:hover { opacity: .85; }
.btn-send:active { opacity: .7; }
.btn-send-primary {
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
}
.btn-send-secondary {
  background: transparent;
  color: var(--vscode-foreground);
  border: 1px solid var(--vscode-widget-border) !important;
}
.send-icon { font-size: 14px; }
</style>
</head>
<body>

<div class="bar">
  <span class="bar-title">Context</span>
  <span class="badge">${count}</span>
  ${count > 0 ? `<button class="btn-sm btn-ghost" id="clearBtn">Clear</button>` : ''}
</div>

<div class="scroll">
  ${blocksHtml}
</div>

${count > 0 ? `
<div class="footer">
  <button class="btn-send btn-send-primary" id="openClaudeBtn">
    <span class="send-icon">⌘</span>
    Open in Claude Code
  </button>
  <button class="btn-send btn-send-secondary" id="copyBtn">
    <span class="send-icon">⎘</span>
    Copy to Clipboard
  </button>
</div>` : ''}

<script nonce="${n}">
const vsc = acquireVsCodeApi();

document.querySelectorAll('[data-remove]').forEach(btn => {
  btn.addEventListener('click', () => {
    vsc.postMessage({ type: 'remove', id: btn.getAttribute('data-remove') });
  });
});

document.querySelectorAll('[data-nav-file]').forEach(el => {
  el.addEventListener('click', () => {
    vsc.postMessage({
      type: 'navigate',
      filePath: el.getAttribute('data-nav-file'),
      startLine: Number(el.getAttribute('data-nav-start')),
      endLine: Number(el.getAttribute('data-nav-end'))
    });
  });
});

const clearBtn = document.getElementById('clearBtn');
if (clearBtn) clearBtn.addEventListener('click', () => vsc.postMessage({ type: 'clear' }));

document.querySelectorAll('.block-check').forEach(cb => {
  cb.addEventListener('change', () => {
    const block = cb.closest('.block');
    if (block) block.classList.toggle('excluded', !cb.checked);
  });
});

function getCheckedIds() {
  return Array.from(document.querySelectorAll('.block-check:checked'))
    .map(cb => cb.getAttribute('data-id'));
}

const openClaudeBtn = document.getElementById('openClaudeBtn');
if (openClaudeBtn) openClaudeBtn.addEventListener('click', () => {
  const ids = getCheckedIds();
  if (ids.length === 0) return;
  vsc.postMessage({ type: 'sendToClaude', ids });
});

const copyBtn = document.getElementById('copyBtn');
if (copyBtn) copyBtn.addEventListener('click', () => {
  const ids = getCheckedIds();
  if (ids.length === 0) return;
  vsc.postMessage({ type: 'copy', ids });
});
</script>
</body>
</html>`;
}
