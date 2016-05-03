var buttonClass = 'vc-button';
if (color) {
  buttonClass += ' vc-button-color-' + color;
}

if (style) {
  buttonClass += ' vc-button-style-' + style;
}

var isRounded = (style == 'rounded') ? true : null;
var iconClass = 'vc-icon vc-icon-size-' + iconSize;
var iconContent = '♘';