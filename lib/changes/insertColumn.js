// @flow
import { type Editor, type Block } from 'slate';

import { TablePosition, createCell } from '../utils';
import moveSelection from './moveSelection';

import type Options from '../options';

/**
 * Insert a new column in current table
 */
function insertColumn(
  opts: Options,
  editor: Editor,
  at ? : number, // Column index
  getCell ? : (column: number, row: number) => Block
): Editor {
  const { value } = editor;

  const pos = TablePosition.create(opts, value.document, value.selection.start.key);
  const { table } = pos;

  const columnIndex =
    typeof at === 'undefined' ? pos.getColumnIndex() + 1 : at;

  // Insert the new cell
  table.nodes.forEach((row, rowIndex) => {
    const newCell = getCell ?
      getCell(columnIndex, rowIndex) :
      createCell(opts);
    editor.insertNodeByKey(row.key, columnIndex, newCell, {
      normalize: false
    });
  });

  // Update the selection (not doing can break the undo)
  return moveSelection(
    opts,
    editor,
    pos.getColumnIndex() + 1,
    pos.getRowIndex()
  );
}

export default insertColumn;
