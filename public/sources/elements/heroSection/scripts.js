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

let rowStyles = {}
if (image) {
  rowStyles.backgroundImage = `url(${image})`
}

let buttonOutput = ''
if (addButton) {
  let vcCake = require('vc-cake')
  const Cook = vcCake.getService('cook')
  let Button = Cook.get(button)
  buttonOutput = Button.render(null, false)
}