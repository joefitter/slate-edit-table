import expect from 'expect';

export default function(plugin, editor) {
    let isDefaultPrevented = false;
    const result = plugin.onKeyDown(
      {
        key: 'Backspace',
        preventDefault() {
          isDefaultPrevented = true;
        },
        stopPropagation() {}
      },
      editor,
      () => {}
    );

    // It shouldn't alter the default behavior...
    expect(isDefaultPrevented).toBe(false);

    // ...and let Slate do the work
    expect(result).toBe(undefined);

    return editor;
}
