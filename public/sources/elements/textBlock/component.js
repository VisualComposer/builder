/* global React, vcvAPI */
/*eslint no-unused-vars: 0*/
class Component extends vcvAPI.elementComponent {
  render () {
    var {id, atts, editor} = this.props
    var {output, designOptions, customClass} = atts // destructuring assignment for attributes from settings.json with access public
    let textBlockClasses = 'vce-text-block vce'
    let customProps = {}
    if (typeof customClass === 'string' && customClass) {
      textBlockClasses = textBlockClasses.concat(' ' + customClass)
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
    if (animations) {
      customProps[ 'data-vce-animate' ] = animations.join(' ')
    }
    return <div className={textBlockClasses} {...editor} {...customProps} id={'el-' + id}>
      {output}
    </div>

  }
}