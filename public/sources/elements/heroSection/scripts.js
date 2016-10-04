let classNames = require('classnames')

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
  let vcCake = require('vc-cake')
  const cook = vcCake.getService('cook')
  let cookElement = cook.get(atts)
  const AssetsManager = vcCake.getService('assets-manager')

  let imgSrc = image
  if (typeof imgSrc !== 'string' && typeof imgSrc.urls[ 0 ] !== 'undefined') {
    imgSrc = imgSrc.urls[0].full
  } else {
    imgSrc = AssetsManager.getPublicPath(cookElement.get('tag'), cookElement.get('image'))
  }

  rowStyles.backgroundImage = `url(${imgSrc})`
}

let buttonOutput = ''
if (addButton) {
  let vcCake = require('vc-cake')
  const Cook = vcCake.getService('cook')
  let Button = Cook.get(button)
  buttonOutput = Button.render(null, false)
}
