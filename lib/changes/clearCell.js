// @flow
import { Block, type Editor } from 'slate';

import type Options from '../options';

/**
 * Clear the content of the given cell
 */
function clearCell(opts: Options, editor: Editor, cell: Block): Editor {
    const newBlock = Block.create({ type: opts.typeContent });
    const { nodes } = cell;

    // Insert a new empty node
    editor.insertNodeByKey(cell.key, 0, newBlock);

    // Remove all previous nodes
    nodes.forEach(node => {
        editor.removeNodeByKey(node.key);
    });

    return editor;
}

export default clearCell;
