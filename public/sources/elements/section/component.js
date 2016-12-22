/* global React, vcvAPI */
/*eslint no-unused-vars: 0*/
class Component extends vcvAPI.elementComponent {
  render () {
    const classNames = require('classnames')

    let { id, atts, editor } = this.props

    let { customClass, designOptions, designOptionsAdvanced } = atts
    let content = this.props.children
    let classes = [ 'vce-section' ]
    let mixinData = this.getMixinData('flatColor')
    if (mixinData) {
      classes.push(`vce-section--color-${mixinData.selector}`)
    }
    let wrapperClasses = []
    let customProps = {}

    if (typeof customClass === 'string' && customClass) {
      wrapperClasses.push(customClass)
    }

    let wrapperClassName = classNames(wrapperClasses)
    let className = classNames(classes)

    // import template
    return (<div className={wrapperClassName} {...editor}>
      <div className={className} id={'el-' + id} {...customProps}>
        {content}
      </div>
    </div>)
  }
}
