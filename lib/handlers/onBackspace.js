// @flow
import { type Editor } from 'slate';

import type Options from '../options';
import { clearCell } from '../changes';

function onBackspace(
  event: * ,
  editor: Editor,
  opts: Options,
  next
): void | Editor {
  const { value } = editor;
  const {
    startBlock,
    endBlock,
    selection,
    document
  } = value;

  const startCell = document.getClosest(startBlock.key, opts.isCell);
  const endCell = document.getClosest(endBlock.key, opts.isCell);

  const startBlockIndex = startCell.nodes.findIndex(
    block => block.key == startBlock.key
  );

  // If a cursor is collapsed at the start of the first block, do nothing
  if (startBlockIndex === 0 && selection.isCollapsed && selection.anchor.isAtStartOfNode(startBlock)) {
    if (startBlock.isVoid) {
      // Delete the block normally if it is a void block
      return next();
    }

    event.preventDefault();
    return editor;
  }

  // If "normal" deletion, we continue
  if (startCell === endCell) {
    return next();
  }

  // If cursor is between multiple blocks,
  // we clear the content of the cells.
  event.preventDefault();

  const { blocks } = value;

  // Get all cells that contains the selection
  const cells = blocks
    .map(
      node =>
      node.type === opts.typeCell ?
      node :
      document.getClosest(
        node.key,
        a => a.type === opts.typeCell
      )
    )
    .toSet();

  // If the cursor is at the very end of the first cell, ignore it.
  // If the cursor is at the very start of the last cell, ignore it.
  // This behavior is to compensate hanging selection behaviors:
  // https://github.com/ianstormtaylor/slate/pull/1605
  const ignoreFirstCell = value.selection
    .moveToStart()
    .anchor
    .isAtEndOfNode(cells.first());
  const ignoreLastCell = value.selection
    .moveToEnd()
    .anchor
    .isAtStartOfNode(cells.last());

  let cellsToClear = cells;
  if (ignoreFirstCell) {
    cellsToClear = cellsToClear.rest();
  }
  if (ignoreLastCell) {
    cellsToClear = cellsToClear.butLast();
  }

  // Clear all the selection
  cellsToClear.forEach(cell => clearCell(opts, editor, cell));

  // Update the selection properly, and avoid reset of selection
  const updatedStartCell = editor.value.document.getDescendant(
    cellsToClear.first().key
  );
  return editor.moveToStartOfNode(updatedStartCell);
}

export default onBackspace;
