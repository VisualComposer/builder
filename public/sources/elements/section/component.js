/* global React, vcvAPI */
/*eslint no-unused-vars: 0*/
class Component extends vcvAPI.elementComponent {
  render () {
    const classNames = require('classnames')

    let { id, atts, editor } = this.props

    let { customClass, designOptions } = atts
    let content = this.props.children
    let classes = [ 'vce-section' ]
    let wrapperClasses = []
    let customProps = {}

    if (typeof customClass === 'string' && customClass) {
      wrapperClasses.push(customClass)
    }

    wrapperClasses = wrapperClasses.concat(vcvAPI.getDesignOptionsCssClasses(designOptions))

    let wrapperClassName = classNames(wrapperClasses)
    let className = classNames(classes)

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

    // import template
    return (<div className={wrapperClassName} {...editor}>
      <div className={className} id={'el-' + id} {...customProps}>
        {content}
      </div>
    </div>)
  }
}
