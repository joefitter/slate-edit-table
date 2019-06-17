// @flow
import { Block, Text, type Editor } from 'slate';

import { TablePosition } from '../utils';
import type Options from '../options';

/**
 * Delete the whole table at the given node key
 */
function removeTableByKey(opts: Options, editor: Editor, key: string): Editor {
  const { value } = editor;

  const pos = TablePosition.create(opts, value.document, key);
  const { table } = pos;
  const { document } = editor.value;
  let nextFocusBlock = null;
  let shouldCollapseToEnd = false;

  const nextBlock = editor.value.document.getNextBlock(table.key);
  if (nextBlock) {
    nextFocusBlock = nextBlock;
  } else {
    const prevBlock = editor.value.document.getPreviousBlock(table.key);
    if (prevBlock) {
      nextFocusBlock = prevBlock;
      shouldCollapseToEnd = true;
    } else if (opts.exitBlockType) {
      nextFocusBlock = Block.create({
        type: opts.exitBlockType,
        nodes: [Text.create('')]
      });
      const tableParent = document.getParent(table.key);
      const insertionIndex = tableParent.nodes.indexOf(table) + 1;
      editor.insertNodeByKey(
        tableParent.key,
        insertionIndex,
        nextFocusBlock
      );
    }
  }

  editor.removeNodeByKey(table.key);
  if (!nextFocusBlock) {
    return editor;
  }
  if (shouldCollapseToEnd) {
    editor.moveToEndOfNode(nextFocusBlock).focus();
  } else {
    editor.moveToStartOfNode(nextFocusBlock).focus();
  }
  return editor;
}

export default removeTableByKey;
