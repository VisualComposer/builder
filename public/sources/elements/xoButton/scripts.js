let classes = 'vce-button-xo'
let buttonHtml = buttonText
let customProps = {}
let CustomTag = 'button'

if (shape && shape !== 'square') {
  classes += ` vce-button-xo--border-${shape}`
}

classes += ` vce-button-xo--style-flat`



let colorClass = []

if (background || color) {
  let re = new RegExp('[\\da-f]+', 'gi')
  colorClass.push(background.match(re) ? background.match(re).join('-') : 'null')
  colorClass.push(color.match(re) ? color.match(re).join('-') : 'null')
  colorClass = colorClass.join('--')
}

if (colorClass) {
  classes += ` vce-button-xo--style-flat--color-${colorClass}`
}

if (showArrow) {
  classes += ' vce-button-xo--icon-state-visible'
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
if (animations.length) {
  customProps[ 'data-vce-animate' ] = animations.join(' ')
}