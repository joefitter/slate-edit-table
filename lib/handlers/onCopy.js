/* @flow */
import { cloneFragment } from 'slate-react';
import { type Editor } from 'slate';

import type Options from '../options';
import { getCopiedFragment } from '../utils';

/**
 *  Handle copying content of tables
 */
function onCopy(
    // The plugin options
    opts?: Options,
    event: *,
    editor: Editor,
    next
): Object {
    const copiedFragment = getCopiedFragment(opts, editor.value);

    if (!copiedFragment) {
        // Default copy behavior
        return next();
    }

    // Override default onCopy
    cloneFragment(event, editor.value, copiedFragment);
    return true;
}

export default onCopy;
