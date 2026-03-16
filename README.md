# Claude Context Annotator

Annotate code regions with descriptions and send them as structured context directly to Claude Code — in one click.

> Works best with the [Claude Code](https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code) VS Code extension installed.

## Why

When asking Claude for help, the hardest part is giving it the right context. This extension lets you pin multiple code regions with short labels, then send them all as a clean structured prompt — without leaving your editor.

## Workflow

1. **Select** lines of code in any file
2. Press **`⌘⇧A`** (Mac) / **`Ctrl+Shift+A`** (Windows/Linux)
   — or right-click → **Add to Claude Context**
3. Type a short label: `"JWT validation"`, `"Auth middleware"`, etc.
4. Repeat for other regions — they accumulate in the sidebar
5. Press **Send to Claude Code** in the sidebar, or **`⌘⇧Enter`** / **`Ctrl+Shift+Enter`**

Claude receives a clean, structured prompt:

```text
# Code Context

Here are the annotated regions of the codebase relevant to this conversation:

## JWT token validation
File: `src/auth/jwt.ts`, lines 12–34

[typescript]
export function validateToken(token: string) {
  ...
}

## Token refresh handler
File: `src/auth/refresh.ts`, lines 56–78

[typescript]
async function refreshAccessToken(refreshToken: string) {
  ...
}
```

## Features

- **Sidebar panel** — accumulated context blocks with checkboxes, file paths, and code previews
- **Selective sending** — uncheck blocks you don't want to include
- **Click to navigate** — click the file path in a block to jump to that code
- **Smart send** — inserts directly into Claude Code chat; falls back to clipboard if Claude Code isn't available
- **Deduplication** — annotating the same region twice updates the existing block

## Keyboard Shortcuts

| Action                              | Mac               | Windows/Linux      |
|-------------------------------------|-------------------|--------------------|
| Add annotation (requires selection) | `Cmd+Shift+A`     | `Ctrl+Shift+A`     |
| Send to Claude Code                 | `Cmd+Shift+Enter` | `Ctrl+Shift+Enter` |

## Requirements

- VS Code 1.85.0 or later
- [Claude Code extension](https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code) (recommended, for direct chat insertion)

## Notes

- Context is stored **in memory only** — cleared when VS Code closes
- No telemetry, no external API calls

## Development

```bash
npm install
npm run compile
# Press F5 in VS Code to launch Extension Development Host
```

Package as `.vsix` for local install:

```bash
npm run package
code --install-extension claude-context-annotator-0.1.1.vsix
```

## Citation

If you use this extension in your research or project, please cite it as:

```bibtex
@misc{claude-context-annotator,
  title        = {Claude Context Annotator},
  author       = {Kadyr Karagishiev},
  year         = {2026},
  howpublished = {VS Code Extension},
  url          = {https://github.com/kadyrkaragishiev/claude-context-annotator},
  note         = {Annotate code regions and send structured context to Claude Code}
}
```
