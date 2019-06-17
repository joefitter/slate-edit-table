export default function(plugin, editor) {
  return plugin.onKeyDown(
    {
      key: 'Backspace',
      preventDefault() {},
      stopPropagation() {}
    },
    editor,
    () => {}
  );
}
