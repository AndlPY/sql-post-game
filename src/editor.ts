import { EditorState, StateEffect, StateField } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine, Decoration, type DecorationSet } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { sql, PostgreSQL } from '@codemirror/lang-sql';
import { syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';

export const highlightSql = StateEffect.define<string>();
const tutorialHighlight = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(value, transaction) {
    if (transaction.docChanged) value = Decoration.none;
    for (const effect of transaction.effects) if (effect.is(highlightSql)) {
      const from = effect.value ? transaction.state.doc.toString().indexOf(effect.value) : -1;
      value = from < 0 ? Decoration.none : Decoration.set([Decoration.mark({ class: 'sql-tutorial-mark' }).range(from, from + effect.value.length)]);
    }
    return value;
  },
  provide: field => EditorView.decorations.from(field),
});

export function mountEditor(parent: HTMLElement, onChange: (sql: string) => void) {
  return new EditorView({ parent, state: EditorState.create({
    doc: 'SELECT * FROM parcels;',
    extensions: [
      lineNumbers(), history(), highlightActiveLine(), tutorialHighlight, closeBrackets(), keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap]),
      sql({ dialect: PostgreSQL }), syntaxHighlighting(HighlightStyle.define([
        { tag: tags.keyword, color: '#54bfff' },
        { tag: tags.number, color: '#ffda75' },
        { tag: tags.string, color: '#b8dc9d' },
        { tag: tags.comment, color: '#8ba2b4' },
        { tag: [tags.operator, tags.punctuation], color: '#f3ebdf' },
      ])),
      EditorView.contentAttributes.of({ 'aria-label': 'SQL-запит', spellcheck: 'false' }),
      EditorView.updateListener.of(update => { if (update.docChanged) onChange(update.state.doc.toString()); }),
      EditorView.theme({
        '&': { height: '100%', color: '#f4f0ed', background: 'transparent', fontSize: 'clamp(14px, 1.05vw, 20px)' },
        '.cm-content': { fontFamily: 'Consolas, monospace', padding: '12px 0', caretColor: '#ffe4a8' },
        '.cm-scroller': { overflow: 'auto', fontFamily: 'Consolas, monospace' },
        '.cm-gutters': { background: '#17212d', color: '#7894b3', border: 'none' },
        '.cm-line': { padding: '0 12px', lineHeight: '1.5' },
        '.cm-activeLine': { background: '#27394b33' },
        '&.cm-focused': { outline: 'none' },
      }, { dark: true }),
    ],
  }) });
}
