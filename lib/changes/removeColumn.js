// @flow
import { type Editor } from 'slate';

import { TablePosition } from '../utils';
import removeColumnByKey from './removeColumnByKey';

import type Options from '../options';

/**
 * Delete current column in a table
 */
function removeColumn(opts: Options, editor: Editor, at: number): Editor {
  const { value } = editor;
  const pos = TablePosition.create(opts, value.document, value.selection.start.key);

  let columnKey;
  if (typeof at === 'undefined') {
    columnKey = pos.cell.key;
  } else {
    columnKey = pos.row.nodes.get(at).key;
  }

  return removeColumnByKey(opts, editor, columnKey);
}

export default removeColumn;
