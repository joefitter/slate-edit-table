/* @flow */
import { getEventTransfer } from 'slate-react';
import { Range, type Editor } from 'slate';

import type Options from '../options';
import { isSelectionInTable, isRangeInTable } from '../utils';
import { insertTableFragmentAtRange } from '../changes';

/**
 *  Handle pasting inside tables
 */
function onPaste(
    // The plugin options
    opts?: Options,
    event: *,
    editor: Editor,
    next
): Object {
    // Outside of tables, do not alter paste behavior
    if (!isSelectionInTable(opts, editor.value)) {
        return next();
    }

    const text = getEventTransfer(event).text;
    editor.insertText(text);
    return null
}

export default onPaste;
