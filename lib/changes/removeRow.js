// @flow
import { type Editor } from 'slate';

import { TablePosition } from '../utils';
import type Options from '../options';
import removeRowByKey from './removeRowByKey';

/**
 * Remove current row in a table. Clear it if last remaining row
 */
function removeRow(opts: Options, editor: Editor, at: number): Editor {
  const { value } = editor;
  const pos = TablePosition.create(opts, value.document, value.selection.start.key);

  let rowKey;
  if (typeof at === 'undefined') {
    rowKey = pos.row.key;
  } else {
    rowKey = pos.table.nodes.get(at).key;
  }

  return removeRowByKey(opts, editor, rowKey);
}

export default removeRow;
