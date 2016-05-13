var classes = 'vce-button';

if (shape && shape !== 'square') {
  classes += ' vce-button--border-' + shape;
}

if (style) {
  classes += ' vce-button--style-' + style;
}

if (textColor) {
  classes += ' vce-button--text-color-' + textColor;
}

if (borderColor) {
  classes += ' vce-button--border-color-' + borderColor;
}

if (backgroundColor) {
  classes += ' vce-button--background-color-' + backgroundColor;
}

if (showIcon) {
  classes += ' vce-button--icon-state-' + showIcon;
}