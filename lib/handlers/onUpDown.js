// @flow
import { type Editor } from 'slate';

import { TablePosition } from '../utils';
import { moveSelectionBy } from '../changes';
import type Options from '../options';

function onUpDown(event: *, editor: Editor, opts: Options): void | Editor {
    const { value } = editor;
    const direction = event.key === 'ArrowUp' ? -1 : +1;
    const pos = TablePosition.create(
        opts,
        value.document,
        value.selection.start.key
    );

    if (
        (pos.isFirstRow() && direction === -1) ||
        (pos.isLastRow() && direction === +1)
    ) {
        // Let the default behavior move out of the table
        return undefined;
    }

    if (direction === -1 && !pos.isTopOfCell()) {
        return undefined;
    }

    if (direction === +1 && !pos.isBottomOfCell()) {
        return undefined;
    }

    event.preventDefault();

    moveSelectionBy(opts, editor, 0, direction);

    return editor;
}

export default onUpDown;
