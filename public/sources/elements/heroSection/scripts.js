/* global React, vcvAPI, vcCake */
let classNames = require('classnames')
let customProps = {}

let wrapperClasses = classNames({
  'vce': true,
  'vce-hero-section': true,
  'vce-hero-section--min-height': true,
  'vce-hero-section--alignment-start': align === 'start',
  'vce-hero-section--alignment-end': align === 'end'
})

let rowClasses = classNames({
  'vce-hero-section__wrap-row': true
})

if (typeof customClass === 'string' && customClass) {
  wrapperClasses = wrapperClasses.concat(' ' + customClass)
}

let rowStyles = {}
if (image) {
  const cook = vcCake.getService('cook')
  let cookElement = cook.get(atts)
  let assetsManager
  if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
    assetsManager = vcCake.getService('wipAssetsManager')
  }
  else {
    assetsManager = vcCake.getService('assets-manager')
  }

  let imgSrc = image
  if (typeof imgSrc !== 'string' && typeof imgSrc.urls[ 0 ] !== 'undefined') {
    imgSrc = imgSrc.urls[0].full
  } else {
    imgSrc = assetsManager.getPublicPath(cookElement.get('tag'), cookElement.get('image'))
  }

  rowStyles.backgroundImage = `url(${imgSrc})`
}

let buttonOutput = ''
if (addButton) {
  const Cook = vcCake.getService('cook')
  let Button = Cook.get(button)
  buttonOutput = Button.render(null, false)
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