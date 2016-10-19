let classes = 'vce-button'
let buttonHtml = buttonText
let customProps = {}
let CustomTag = 'button'


if (addUrl) {
  CustomTag = 'a'
  let { url, title, targetBlank, relNofollow } = buttonUrl
  customProps = {
    'href': url,
    'title': title,
    'target': targetBlank ? '_blank' : undefined,
    'rel': relNofollow ? 'nofollow' : undefined
  }
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

if (animate) {
  classes += ` vce-button--animate-${animate}`
}

let devices = designOptions.visibleDevices ? Object.keys(designOptions.visibleDevices) : []
let animations = []
devices.forEach((device) => {
  let prefix = designOptions.visibleDevices[ device ]
  if (designOptions[ device ].animation) {
    if (prefix) {
      prefix = `-${prefix}`
    }
    animations.push(`vce-o-animate--${designOptions[ device ].animation}${prefix}`)
  }
})
if (animations) {
  customProps[ 'data-vce-animate' ] = animations.join(' ')
}