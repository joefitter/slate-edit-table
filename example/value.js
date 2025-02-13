/** @jsx h */
// eslint-disable-next-line import/no-extraneous-dependencies
import { createHyperscript } from 'slate-hyperscript';

const h = createHyperscript({
    blocks: {
        heading: 'heading',
        paragraph: 'paragraph',
        table: 'table',
        table_row: 'table_row',
        table_cell: 'table_cell',
        image: {
            type: 'image',
            isVoid: true
        }
    },
    inlines: {
        link: 'link'
    }
});

export default (
    <value>
        <document>
            <table>
                <table_row>
                    <table_cell>
                        <paragraph>
                            <anchor />
                            Col 0, Row 0<focus />
                        </paragraph>
                    </table_cell>
                    <table_cell>
                        <paragraph>Col 1, Row 0</paragraph>
                    </table_cell>
                    <table_cell>
                        <paragraph>Col 2, Row 0</paragraph>
                    </table_cell>
                </table_row>
                <table_row>
                    <table_cell>
                        <paragraph>Col 0, Row 1</paragraph>
                    </table_cell>
                    <table_cell>
                        <paragraph>Col 1, Row 1</paragraph>
                    </table_cell>
                    <table_cell>
                        <paragraph>Col 2, Row 1</paragraph>
                    </table_cell>
                </table_row>
                <table_row>
                    <table_cell>
                        <paragraph>Col 0, Row 2</paragraph>
                    </table_cell>
                    <table_cell>
                        <paragraph>Col 1, Row 2</paragraph>
                    </table_cell>
                    <table_cell>
                        <paragraph>Col 2, Row 2</paragraph>
                    </table_cell>
                </table_row>
            </table>
        </document>
    </value>
);
