/* global React, vcvAPI */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  render () {
    var { id, atts, editor } = this.props
    var { customClass, layout, designOptions, assetsLibrary, rowWidth, removeSpaces } = atts
    var content = this.props.children

    let classes = [ 'vce-row' ]
    let customProps = {}
    let customRowProps = {}
    const classNames = require('classnames')
    // reverse classes.push('vce-row-wrap--reverse')
    if (typeof customClass === 'string' && customClass) {
      classes.push(customClass)
    }
    classes = classes.concat(vcvAPI.getDesignOptionsCssClasses(designOptions))

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

    let fullWidthHelper = ''
    if (rowWidth === 'stretchedRow' || rowWidth === 'stretchedRowAndColumn') {
      customRowProps[ 'data-vce-full-width' ] = true
    } else {
      customRowProps.style = {
        width: null,
        left: null
      }
      customProps.style = {
        paddingLeft: null,
        paddingRight: null
      }
    }

    if (rowWidth === 'stretchedRowAndColumn') {
      customRowProps[ 'data-vce-stretch-content' ] = true
    }

    if (removeSpaces) {
      classes.push('vce-row-no-paddings')
    }

    let className = classNames(classes)

    return <div className='vce-row-container'>
      <div className={className} {...customRowProps} {...editor}>
        <div className='vce-row-content' id={'el-' + id} {...customProps}>
          {content}
        </div>
      </div>
    </div>
  }
}
