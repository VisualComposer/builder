let classes = 'vce-button'
let buttonHtml = buttonText
let customProps = {}
let CustomTag = 'button'


if (shape && shape !== 'square') {
  classes += ` vce-button--border-${shape}`
}

  classes += ` vce-button--style-flat`
  classes += ` vce-button--text-color-white`
  classes += ` vce-button--background-color-fire-brick`

if (showArrow) {
  classes += ' vce-button--icon-state-visible'
}

if (animate) {
  classes += ` vce-button--animate-${animate}`
}
