/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import expect from 'expect';
import fs from 'fs';
import path from 'path';
import { Value, KeyUtils, Editor, Block, Document, Text } from 'slate';
import EditTable from '../lib';

const PLUGIN = EditTable();

function deserializeValue(value) {
  return Value.fromJSON({
    document: value.document,
    selection: value.selection
  });
}

describe('slate-edit-table', () => {
  const tests = fs.readdirSync(__dirname);

  tests.forEach(test => {
    if (test[0] === '.' || path.extname(test).length > 0) return;

    it(test, () => {
      KeyUtils.resetGenerator();
      const dir = path.resolve(__dirname, test);
      const input = require(path.resolve(dir, 'input.js')).default;
      const expectedPath = path.resolve(dir, 'expected.js');
      const expected = fs.existsSync(expectedPath) && require(expectedPath).default;

      const runChange = require(path.resolve(dir, 'change.js')).default;

      const value = deserializeValue(input);

      const editor = new Editor({
        value,
        plugins: [PLUGIN]
      })

      setTimeout(() => {
        editor.select(value.selection)
      });

      const newChange = runChange(PLUGIN, editor);

      if (expected) {
        console.log('ok up until now')
        const newDoc = newChange.value.document.toJSON();

        console.log('got here')
        expect(newDoc).toEqual(
          expected.document.toJSON()
        );

        // Check that the selection is still valid
        if (!newChange.value.document.nodes.isEmpty()) {
          expect(newChange.value.startBlock).toExist(null);
        }
      }
    });
  });
});
