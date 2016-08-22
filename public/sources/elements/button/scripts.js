let classes = 'vce-button'
let buttonHtml = buttonText

if (addUrl) {
  let { url, title, targetBlank, relNofollow } = buttonUrl
  buttonHtml = (
    <a
      href={url}
      title={title}
      target={targetBlank ? '_BLANK' : undefined}
      rel={relNofollow ? 'nofollow' : undefined}
    >
      {buttonText}
    </a>
  )
}

if (shape && shape !== 'square') {
  classes += ` vce-button--border-${shape}`
}

if (style) {
  classes += ` vce-button--style-${style}`
}

if (textColor) {
  classes += ` vce-button--text-color-${textColor}`
}

if (borderColor) {
  classes += ` vce-button--border-color-${borderColor}`
}

if (backgroundColor) {
  classes += ` vce-button--background-color-${backgroundColor}`
}

if (showArrow) {
  classes += ' vce-button--icon-state-visible'
}
