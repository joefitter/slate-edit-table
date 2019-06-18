// @flow
import { type Editor, type SlateError } from 'slate';
import { NODE_DATA_INVALID } from 'slate-schema-violations';
import PluginEditTable from '../lib/';

/*
 * This file contains an example of cell align management extension.
 */

const tablePlugin = PluginEditTable({
    typeTable: 'table',
    typeRow: 'table_row',
    typeCell: 'table_cell',
    typeContent: 'paragraph'
});

/*
 * Set align data for the current column
 */
function setColumnAlign(editor: Editor, align: string): Editor {
    const pos = tablePlugin.queries.getPosition(editor.value);
    const columnCells = tablePlugin.queries.getCellsAtColumn(
        pos.table,
        pos.getColumnIndex()
    );
    columnCells.forEach(cell => {
        editor.setNodeByKey(cell.key, { data: { align } });
    });
    return editor;
}

const alignPlugin = {
    schema: {
        blocks: {
            table_cell: {
                data: {
                    // Make sure cells have an alignment
                    align: align => ['left', 'center', 'right'].includes(align)
                },
                normalize(editor: Editor, error: SlateError) {
                    if (error.code === NODE_DATA_INVALID) {
                        editor.setNodeByKey(error.node.key, {
                            data: error.node.data.set('align', 'left')
                        });
                    }
                }
            }
        }
    },

    commands: {
        setColumnAlign
    }
};

export default alignPlugin;
