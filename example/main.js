// @flow
/* eslint-disable import/no-extraneous-dependencies */
/* global document */

import * as React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { type Block } from 'slate';
import { Editor } from 'slate-react';

import PluginEditTable from '../lib/';
// import alignPlugin from './aligns';
import INITIAL_VALUE from './value';

INITIAL_VALUE.selection.focus.path.map((a, b) => console.log(a, b))
console.log(INITIAL_VALUE.selection.toJSON())
console.log(INITIAL_VALUE.selection.isSet)

const tablePlugin = PluginEditTable({
    typeTable: 'table',
    typeRow: 'table_row',
    typeCell: 'table_cell',
    typeContent: 'paragraph'
});

function renderBlock(props, editor, next) {
    switch (props.node.type) {
        case 'table':
            return <Table {...props} />;
        case 'table_row':
            return <TableRow {...props} />;
        case 'table_cell':
            return <TableCell {...props} />;
        case 'paragraph':
            return <Paragraph {...props} />;
        case 'heading':
            return <h1 {...props.attributes}>{props.children}</h1>;
        default:
            return next();
    }
}

const plugins = [tablePlugin];

type NodeProps = {
    attributes: Object,
    children: React.Node,
    node: Block
};

class Table extends React.Component<NodeProps> {
    static childContextTypes = {
        isInTable: PropTypes.bool
    };

    getChildContext() {
        return { isInTable: true };
    }

    render() {
        const { attributes, children } = this.props;
        return (
            <table>
                <tbody {...attributes}>{children}</tbody>
            </table>
        );
    }
}

class TableRow extends React.Component<NodeProps> {
    render() {
        const { attributes, children } = this.props;
        return <tr {...attributes}>{children}</tr>;
    }
}

class TableCell extends React.Component<NodeProps> {
    render() {
        const { attributes, children, node } = this.props;

        const textAlign = node.get('data').get('align', 'left');

        return (
            <td style={{ textAlign }} {...attributes}>
                {children}
            </td>
        );
    }
}

class Paragraph extends React.Component<NodeProps> {
    static contextTypes = {
        isInTable: PropTypes.bool
    };

    render() {
        const { attributes, children } = this.props;
        const { isInTable } = this.context;

        const style = isInTable ? { margin: 0 } : {};

        return (
            <p style={style} {...attributes}>
                {children}
            </p>
        );
    }
}

class Example extends React.Component<*, *> {
    editor: Editor;
    state = {
        value: INITIAL_VALUE
    };

    renderTableToolbar() {
        return (
            <div className="toolbar">
                <button onMouseDown={this.onInsertColumn}>Insert Column</button>
                <button onMouseDown={this.onInsertRow}>Insert Row</button>
                <button onMouseDown={this.onRemoveColumn}>Remove Column</button>
                <button onMouseDown={this.onRemoveRow}>Remove Row</button>
                <button onMouseDown={this.onRemoveTable}>Remove Table</button>
                <br />
                <button onMouseDown={e => this.onSetAlign(e, 'left')}>
                    Set align left
                </button>
                <button onMouseDown={e => this.onSetAlign(e, 'center')}>
                    Set align center
                </button>
                <button onMouseDown={e => this.onSetAlign(e, 'right')}>
                    Set align right
                </button>
            </div>
        );
    }

    renderNormalToolbar() {
        return (
            <div className="toolbar">
                <button onClick={this.onInsertTable}>Insert Table</button>
            </div>
        );
    }

    setEditorComponent = (ref: Editor) => {
        this.editor = ref;
        console.log(this.editor.value.selection.anchor.key)
        console.log(this.editor.value.selection.focus.key)

        // console.log('RANGE', this.editor.findDOMRange(this.editor.value.selection))
        // this.editor.updateSelection(this.editor.value.selection)
        setTimeout(() => {
          this.editor.select(INITIAL_VALUE.selection)
        })
    };

    onChange = ({ value }) => {
        this.setState({
            value
        });
    };

    onInsertTable = event => {
        event.preventDefault();
        this.editor.insertTable();
    };

    onInsertColumn = event => {
        event.preventDefault();
        this.editor.insertColumn();
    };

    onInsertRow = event => {
        event.preventDefault();
        this.editor.insertRow();
    };

    onRemoveColumn = event => {
        event.preventDefault();
        this.editor.removeColumn();
    };

    onRemoveRow = event => {
        event.preventDefault();
        this.editor.removeRow();
    };

    onRemoveTable = event => {
        event.preventDefault();
        this.editor.removeTable();
    };

    onSetAlign = (event, align) => {
      event.preventDefault();
      this.editor.setColumnAlign(event, align)
    };

    render() {
        const { value } = this.state;
        const isInTable = tablePlugin.queries.isSelectionInTable(value);
        const isOutTable = tablePlugin.queries.isSelectionOutOfTable(value);

        setTimeout(() => {
          // this.editor.focus()
        }, 1)

        return (
            <React.Fragment>
                {isInTable ? this.renderTableToolbar() : null}
                {isOutTable ? this.renderNormalToolbar() : null}
                <Editor
                    ref={this.setEditorComponent}
                    placeholder={'Enter some text...'}
                    plugins={plugins}
                    value={value}
                    renderBlock={renderBlock}
                    onChange={this.onChange}
                />
            </React.Fragment>
        );
    }
}

// $FlowFixMe
ReactDOM.render(<Example />, document.getElementById('example'));
