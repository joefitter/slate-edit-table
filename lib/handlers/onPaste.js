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

    const transfer = getEventTransfer(event);
    const { type, fragment } = transfer;

    if (type != 'fragment' || fragment.nodes.isEmpty()) {
        return null;
    }

    if (
        !isRangeInTable(
            opts,
            fragment,
            Range.create({
                anchorKey: fragment.getFirstText().key,
                focusKey: fragment.getLastText().key
            })
        )
    ) {
        return null;
    }

    return insertTableFragmentAtRange(
        opts,
        editor,
        editor.value.selection,
        fragment
    );
}

export default onPaste;
