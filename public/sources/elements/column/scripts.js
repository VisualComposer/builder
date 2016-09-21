const classNames = require('classnames')

let classes = ['vce-col', 'vce-col--xs-1']
classes.push('vce-col--sm-' + (size ? size.replace('/', '-') : 'auto'))
// reverse classes.push('vce-row-wrap--reverse')
if (typeof customClass === 'string' && customClass.length) {
  classes.push(customClass)
}

classes = classes.concat(vcvAPI.getDesignOptionsCssClasses(designOptions))


let className = classNames(classes)