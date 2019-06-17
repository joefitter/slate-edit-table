// @flow

import { Block, type Editor, type SlateError } from 'slate';
import {
  CHILD_OBJECT_INVALID,
  CHILD_TYPE_INVALID,
  PARENT_TYPE_INVALID
} from 'slate-schema-violations';
import { createCell } from '../utils';
import type Options from '../options';

/*
 * Returns a schema definition for the plugin
 */
function schema(opts: Options): Object {
  return {
    blocks: {
      [opts.typeTable]: {
        nodes: [{ types: [opts.typeRow] }]
      },
      [opts.typeRow]: {
        nodes: [{ types: [opts.typeCell] }],
        parent: { types: [opts.typeTable] },
        normalize(editor: Editor, error: SlateError) {
          switch (error.code) {
            case CHILD_TYPE_INVALID:
              return onlyCellsInRow(opts, editor, error);
            case PARENT_TYPE_INVALID:
              return rowOnlyInTable(opts, editor, error);
            default:
              return undefined;
          }
        }
      },
      [opts.typeCell]: {
        nodes: [{ objects: ['block'] }],
        parent: { types: [opts.typeRow] },
        normalize(editor: Editor, error: SlateError) {
          switch (error.code) {
            case CHILD_OBJECT_INVALID:
              return onlyBlocksInCell(opts, editor, error);
            case PARENT_TYPE_INVALID:
              return cellOnlyInRow(opts, editor, error);
            default:
              return undefined;
          }
        }
      }
    }
  };
}

/*
 * A row's children must be cells.
 * If they're not then we wrap them within a cell.
 */
function onlyCellsInRow(opts: Options, editor: Editor, error: SlateError) {
  const cell = createCell(opts, []);
  const index = error.node.nodes.findIndex(
    child => child.key === error.child.key
  );
  editor
    .insertNodeByKey(error.node.key, index, cell)
    .moveNodeByKey(error.child.key, cell.key, 0);
}

/*
 * Rows can't live outside a table, if one is found then we wrap it within a table.
 */
function rowOnlyInTable(opts: Options, editor: Editor, error: SlateError) {
  return editor.wrapBlockByKey(error.node.key, opts.typeTable);
}

/*
 * A cell's children must be "block"s.
 * If they're not then we wrap them within a block with a type of opts.typeContent
 */
function onlyBlocksInCell(opts: Options, editor: Editor, error: SlateError) {
  const block = Block.create({
    type: opts.typeContent
  });
  editor.insertNodeByKey(error.node.key, 0, block);

  const inlines = error.node.nodes.filter(node => node.object !== 'block');
  inlines.forEach((inline, index) => {
    editor.moveNodeByKey(inline.key, block.key, index);
  });
}

/*
 * Cells can't live outside a row, if one is found then we wrap it within a row.
 */
function cellOnlyInRow(opts: Options, editor: Editor, error: SlateError) {
  return editor.wrapBlockByKey(error.node.key, opts.typeRow);
}

export default schema;
