// @flow
import { type Editor } from 'slate';

import { TablePosition } from '../utils';
import type Options from '../options';

/**
 * Move selection to {x,y}
 */
function moveSelection(
  opts: Options,
  editor: Editor,
  x: number,
  y: number
): Editor {
  const { value } = editor;
  const pos = TablePosition.create(opts, value.document, value.selection.start.key);

  if (!pos.isInCell()) {
    throw new Error('moveSelection can only be applied from within a cell');
  }

  const { table } = pos;
  const row = table.nodes.get(y);
  const cell = row.nodes.get(x);

  return editor.moveToStartOfNode(cell);
}

export default moveSelection;
