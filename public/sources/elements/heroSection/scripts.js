let classNames = require('classnames')

let wrapperClasses = classNames({
  'vce-hero-section': true,
  'vce-hero-section--min-height': true,
  'vce-hero-section--alignment-start': align === 'start',
  'vce-hero-section--alignment-end': align === 'end'
})
