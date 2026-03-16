import { AnnotatedBlock } from './types';
import { getRelPath } from './utils';

export class ContextStore {
  private blocks: AnnotatedBlock[] = [];
  private listeners: Array<() => void> = [];

  onChange(cb: () => void) { this.listeners.push(cb); }
  private notify() { this.listeners.forEach(cb => cb()); }

  add(block: AnnotatedBlock) {
    const idx = this.blocks.findIndex(
      b => b.filePath === block.filePath &&
           b.startLine === block.startLine &&
           b.endLine === block.endLine
    );
    if (idx !== -1) {
      this.blocks[idx] = block;
    } else {
      this.blocks.push(block);
    }
    this.notify();
  }

  remove(id: string) {
    this.blocks = this.blocks.filter(b => b.id !== id);
    this.notify();
  }

  clear() {
    this.blocks = [];
    this.notify();
  }

  getAll(): AnnotatedBlock[] { return [...this.blocks]; }
  isEmpty(): boolean { return this.blocks.length === 0; }

  toPrompt(ids?: string[]): string {
    const blocks = ids ? this.blocks.filter(b => ids.includes(b.id)) : this.blocks;
    const lines: string[] = [
      '# Code Context\n',
      'Here are the annotated regions of the codebase relevant to this conversation:\n'
    ];

    for (const b of blocks) {
      const relPath = getRelPath(b.filePath);
      lines.push(`## ${b.annotation || `${getRelPath(b.filePath)}:${b.startLine + 1}–${b.endLine + 1}`}`);
      lines.push(`File: \`${relPath}\`, lines ${b.startLine + 1}–${b.endLine + 1}`);
      lines.push('');
      lines.push(`\`\`\`${b.language}`);
      lines.push(b.code);
      lines.push('```');
      lines.push('');
    }

    lines.push('---\n');
    return lines.join('\n');
  }
}
