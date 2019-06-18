// @flow
import { type Editor } from 'slate';

import { TablePosition } from '../utils';
import { moveSelectionBy, insertRow } from '../changes';
import type Options from '../options';

/**
 * Select all text of current block.
 */
function selectAllText(editor: Editor): Editor {
    const { value } = editor;
    const { startBlock } = value;

    return editor.moveFocusTo(startBlock.text.length);
}

/**
 * Pressing "Tab" moves the cursor to the next cell
 * and select the whole text
 */
function onTab(event: *, editor: Editor, opts: Options): void | Editor {
    event.preventDefault();
    const { value } = editor;
    const direction = event.shiftKey ? -1 : +1;

    // Create new row if needed
    const { selection } = value;
    const pos = TablePosition.create(opts, value.document, selection.start.key);
    if (pos.isFirstCell() && direction === -1) {
        insertRow(opts, editor, 0);
    } else if (pos.isLastCell() && direction === 1) {
        insertRow(opts, editor);
    }

    // Move back to initial cell (insertRow moves selection automatically).
    editor.select(selection);

    // Move
    moveSelectionBy(opts, editor, direction, 0);

    // Select all cell.
    return selectAllText(editor);
}

export default onTab;
