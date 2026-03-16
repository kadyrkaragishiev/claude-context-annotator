export interface AnnotatedBlock {
  id: string;
  annotation: string;
  filePath: string;
  startLine: number;
  endLine: number;
  code: string;
  language: string;
}
