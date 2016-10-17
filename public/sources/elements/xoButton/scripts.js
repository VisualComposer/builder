let classes = 'vce-button-xo'
let buttonHtml = buttonText
let customProps = {}
let CustomTag = 'button'


if (shape && shape !== 'square') {
  classes += ` vce-button-xo--border-${shape}`
}

  classes += ` vce-button-xo--style-flat`
  classes += ` vce-button-xo--text-color-white`
  classes += ` vce-button-xo--background-color-fire-brick`

if (showArrow) {
  classes += ' vce-button-xo--icon-state-visible'
}

if (animate) {
  classes += ` vce-o-animate--${animate} vce-o-animate--animated vce-o-animate--infinite`
}
