// @flow
import { type Editor } from 'slate';

import { TablePosition } from '../utils';
import clearCell from './clearCell';
import type Options from '../options';

/**
 * Remove the row associated to a given key in a table.
 * Clear thw row if last remaining row
 */
function removeRowByKey(opts: Options, editor: Editor, key: string): Editor {
  const { value } = editor;

  const pos = TablePosition.create(opts, value.document, key);

  // Update table by removing the row
  if (pos.getHeight() > 1) {
    editor.removeNodeByKey(key);
  } else {
    // If last remaining row, clear it instead
    pos.row.nodes.forEach(cell => {
      cell.nodes.forEach(node => clearCell(opts, editor, cell));
    });
  }

  return editor;
}

export default removeRowByKey;
