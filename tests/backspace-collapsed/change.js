export default function(plugin, editor) {
    const { value } = editor;
    const blockStart = value.document.getDescendant('anchor');

    const withCursor = editor.moveToStartOfNode(blockStart);

    plugin.onKeyDown(
        {
            key: 'Backspace',
            preventDefault() {},
            stopPropagation() {}
        },
        withCursor
    );

    return editor;
}
