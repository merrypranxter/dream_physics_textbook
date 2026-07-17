import type { ElementType, ReactNode } from 'react';
import type { Chapter } from '../content/manifest';

type MarkdownDocumentProps = {
  chapter: Chapter;
  searchTerm?: string;
};

const SOURCE_BASE = 'https://github.com/merrypranxter/dream_physics/blob/main/textbook/';

function cleanMarkdown(raw: string, chapter: Chapter) {
  const normalized = raw.replace(/^\uFEFF/, '').replace(/\r/g, '');
  const lines = normalized.split('\n');
  const firstRule = lines.findIndex((line) => /^---\s*$/.test(line));
  const body = firstRule >= 0 ? lines.slice(firstRule + 1) : lines;
  const disposable = new Set([
    'DREAM PHYSICS',
    'A Field Manual of the Sleeping Cosmos',
    `Chapter ${chapter.number} — ${chapter.title}`,
    chapter.subtitle,
  ]);

  return body
    .filter((line) => {
      const value = line.trim();
      if (disposable.has(value)) return false;
      if (/^\[📖 Textbook Index\]/.test(value)) return false;
      return true;
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function inline(text: string): ReactNode[] {
  const pieces = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return pieces.filter(Boolean).map((piece, index) => {
    if (piece.startsWith('**') && piece.endsWith('**')) return <strong key={index}>{piece.slice(2, -2)}</strong>;
    if (piece.startsWith('*') && piece.endsWith('*')) return <em key={index}>{piece.slice(1, -1)}</em>;
    if (piece.startsWith('`') && piece.endsWith('`')) return <code key={index}>{piece.slice(1, -1)}</code>;
    const link = piece.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = /^https?:/.test(link[2]) ? link[2] : `${SOURCE_BASE}${link[2]}`;
      return <a key={index} href={href} target="_blank" rel="noreferrer">{link[1]}</a>;
    }
    return piece;
  });
}

function paragraphClass(text: string) {
  const equation = /[=∝→]|equation|threshold|stability|coherence|entropy|probability/i.test(text) && text.length < 180;
  const definition = /^(Definition|Interpretation|Principle|Result|Thus|Therefore):?$/i.test(text.trim());
  return equation ? 'equation-block' : definition ? 'definition-label' : undefined;
}

export function MarkdownDocument({ chapter, searchTerm = '' }: MarkdownDocumentProps) {
  const markdown = cleanMarkdown(chapter.raw, chapter);
  const lines = markdown.split('\n');
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = Math.min(heading[1].length + 1, 6);
      const Tag = `h${level}` as ElementType;
      blocks.push(<Tag key={`h-${index}`}>{inline(heading[2])}</Tag>);
      index += 1;
      continue;
    }

    if (/^---+$/.test(line) || /^_{3,}$/.test(line)) {
      blocks.push(<div className="sigil-divider" aria-hidden="true" key={`rule-${index}`}>· ✦ · ≈ · ✦ ·</div>);
      index += 1;
      continue;
    }

    const numberedSection = line.match(/^\d+\.\s+([A-Z][^.!?]{2,100})$/);
    if (numberedSection || /^Chapter \d+ Conclusion$/i.test(line) || /^(Field Exercises|Conclusion|Summary|Part [IVX\d]+)/i.test(line)) {
      blocks.push(<h2 key={`section-${index}`}>{inline(numberedSection ? numberedSection[1] : line)}</h2>);
      index += 1;
      continue;
    }

    if (line.startsWith('>')) {
      const quote: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith('>')) {
        quote.push(lines[index].trim().replace(/^>\s?/, ''));
        index += 1;
      }
      blocks.push(<blockquote key={`quote-${index}`}>{inline(quote.join(' '))}</blockquote>);
      continue;
    }

    const bulletPattern = /^(?:[-*•]|\d+[.)])\s+(.+)$/;
    if (bulletPattern.test(line)) {
      const ordered = /^\d/.test(line);
      const items: string[] = [];
      while (index < lines.length) {
        const current = lines[index].trim();
        const match = current.match(bulletPattern);
        if (match) {
          items.push(match[1]);
          index += 1;
          while (index < lines.length && !lines[index].trim()) index += 1;
        } else break;
      }
      const List = ordered ? 'ol' : 'ul';
      blocks.push(<List key={`list-${index}`}>{items.map((item, itemIndex) => <li key={itemIndex}>{inline(item)}</li>)}</List>);
      continue;
    }

    const paragraph = [line];
    index += 1;
    while (index < lines.length) {
      const next = lines[index].trim();
      if (!next || /^(#{1,6})\s+/.test(next) || /^---+$/.test(next) || /^_{3,}$/.test(next) || next.startsWith('>') || bulletPattern.test(next)) break;
      paragraph.push(next);
      index += 1;
    }
    const text = paragraph.join(' ');
    blocks.push(<p className={paragraphClass(text)} key={`p-${index}`}>{inline(text)}</p>);
  }

  return (
    <div className="markdown-document" data-searching={searchTerm ? 'true' : 'false'}>
      {blocks}
    </div>
  );
}
