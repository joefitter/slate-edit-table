// @flow
import { type Editor } from 'slate';

import type Options from '../options';
import removeTableByKey from './removeTableByKey';

/**
 * Delete the whole table at position
 */
function removeTable(opts: Options, editor: Editor): Editor {
    const { value } = editor;
    return removeTableByKey(opts, editor, value.selection.start.key);
}

export default removeTable;
