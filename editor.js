/* globals CodeMirror, $ */
const editor = CodeMirror.fromTextArea($('#editor')[0], {
  lineNumbers: true,
  mode: 'gfm',
  lineWrapping: true,
  tabSize: 2,
  indentWithTabs: false,
  matchBrackets: true,
  autoCloseBrackets: true
});

/* Status bar and settings page */
const $statusBar = $(`
  <div class='pnmm-statusbar' />
`);
const $statusBarLeft = $(`
  <div class='pnmm-statusbar-left' />
`).appendTo($statusBar);
const $statusBarRight = $(`
  <div class='pnmm-statusbar-right' />
`).appendTo($statusBar);

const $settingsPane = $(`
  <div class='pnmm-settingspane' style='display:none'/>
`);
const $settingsButton = $(`
  <a href='javascript:;' class='pnmm-statusbar-item pnmm-settings'>Settings</a>
`).on('click', function () {
  $settingsPane.toggle();
}).appendTo($statusBarRight);

/* Unordered list hanging indent */
// TODO: Ordered lists too
const unorderedListLineRegExp = /^\s*[-+*]\s+/;
editor.on('renderLine', function(cm, line, elt) {
  const result = unorderedListLineRegExp.exec(line.text);
  if (!result) return;
  var off = editor.defaultCharWidth() * result[0].length;
  elt.style.textIndent = '-' + off + 'px';
  elt.style.paddingLeft = 4 + off + 'px';
});

/* On tab, insert spaces */
// TODO: review this
editor.setOption('extraKeys', {
  Tab: function(cm) { cm.execCommand('insertSoftTab'); }
});

/* Status bar: Toggle line numbers */
$settingsPane.append($(`
  <div class='pnmm-setting pnmm-linenos' />
`).append(`
  <span class='pnmm-setting-label'>Line Numbers</span>
`).append(
  $(`
    <input type=checkbox class='pnmm-setting-input' checked>
  `).on('change', function () {
    const $this = $(this);
    const $setting = $this.closest('.pnmm-setting');
    if ($this.is(':checked')) {
      $setting.toggleClass('enabled', true);
      editor.setOption('lineNumbers', true);
    } else {
      $setting.toggleClass('enabled', false);
      editor.setOption('lineNumbers', false);
    }
  })
));

/* Status bar: Toggle syntax highlighting */
$settingsPane.append($(`
  <div class='pnmm-setting pnmm-highlighting' />
`).append(`
  <span class='pnmm-setting-label'>Syntax highlighting</span>
`).append(
  $(`
    <input type=checkbox class='pnmm-setting-input' checked>
  `).on('change', function () {
    const $this = $(this);
    const $setting = $this.closest('.pnmm-setting');
    if ($this.is(':checked')) {
      $setting.toggleClass('enabled', true);
      editor.setOption('mode', 'gfm');
    } else {
      $setting.toggleClass('enabled', false);
      editor.setOption('mode', '');
    }
  })
));

$settingsPane.append($(`
  <div class='pnmm-setting pnmm-bigtext' />
`).append(`
  <span class='pnmm-setting-label'>Big headings</span>
`).append(
  $(`
    <input type=checkbox class='pnmm-setting-input' checked>
  `).on('change', function () {
    const $this = $(this);
    const $setting = $this.closest('.pnmm-setting');
    if ($this.is(':checked')) {
      $setting.toggleClass('enabled', true);
      $(editor.getWrapperElement()).toggleClass('bigHeadings', true);
    } else {
      $setting.toggleClass('enabled', false);
      $(editor.getWrapperElement()).toggleClass('bigHeadings', false);
    }
  })
));

/* Status bar: Toggle line stripes in gutter */
$settingsPane.append($(`
  <div class='pnmm-setting pnmm-zebra-gutter' />
`).append(`
  <span class='pnmm-setting-label'>Gutter line stripes</span>
`).append(
  $(`
    <input type=checkbox class='pnmm-setting-input'>
  `).on('change', function () {
    const $this = $(this);
    const $setting = $this.closest('.pnmm-setting');
    if ($this.is(':checked')) {
      $setting.toggleClass('enabled', true);
      $(editor.getWrapperElement()).toggleClass('zebraGutter', true);
    } else {
      $setting.toggleClass('enabled', false);
      $(editor.getWrapperElement()).toggleClass('zebraGutter', false);
    }
  })
));

/* Status bar: Show current position */
const $ruler = $(`<span class='pnmm-statusbar-item pnmm-ruler'>0:0</span>`);
$statusBarRight.prepend($ruler);
editor.on('cursorActivity', function () {
  const {line, ch} = editor.getDoc().getCursor();
  $ruler.text(`${line + 1}:${ch + 1}`);
});

/* Add our custom things to the editor */
$(editor.getWrapperElement())
  .toggleClass('pnmmEditor')
  .toggleClass('bigHeadings')
  .append($statusBar, $settingsPane);
/* Hooray */
window.pnmmEditor = editor;
