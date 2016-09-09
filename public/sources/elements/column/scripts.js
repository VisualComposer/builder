const AddElement = require('../../primitives/addElement/component').default
const vcCake = require('vc-cake')

let classes = ['vce-col', 'vce-col--xs-1']
const classNames = require('classnames')
classes.push('vce-col--sm-' + (size || 'auto')) // here should go width
// reverse classes.push('vce-row-wrap--reverse')
if (typeof customClass === 'string' && customClass.length) {
  classes.push(customClass)
}
let className = classNames(classes)

let addElementContent = null
if (vcCake.env('FEATURE_ROW_ADD_ELEMENT')) {
  addElementContent = <AddElement />
}
