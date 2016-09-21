let classes = ['vce-row']
const classNames = require('classnames')
// reverse classes.push('vce-row-wrap--reverse')
if (typeof customClass === 'string' && customClass) {
  classes.push(customClass)
}
classes = classes.concat(vcvAPI.getDesignOptionsCssClasses(designOptions))

let className = classNames(classes)
