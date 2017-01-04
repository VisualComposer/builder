/* global React, vcvAPI */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  render () {
    var { id, atts, editor } = this.props
    var { customClass, designOptions, rowWidth, removeSpaces, columnGap, fullHeight, metaCustomId, equalHeight } = atts
    var content = this.props.children

    let classes = [ 'vce-row' ]
    let contentClasses = [ 'vce-row-content' ]
    let customProps = {
      style: {}
    }
    let customRowProps = {
      style: {}
    }
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

    if (parseInt(columnGap)) {
      let mixinData = this.getMixinData('columnGap')
      if (mixinData) {
        classes.push(`vce-row--gap-${mixinData.selector}`)
      }
    }

    if (rowWidth === 'stretchedRow' || rowWidth === 'stretchedRowAndColumn') {
      customRowProps[ 'data-vce-full-width' ] = true
    } else {
      customRowProps.style.width = ''
      customRowProps.style.left = ''
      customProps.style.paddingLeft = ''
      customProps.style.paddingRight = ''
    }

    if (rowWidth === 'stretchedRowAndColumn') {
      customRowProps[ 'data-vce-stretch-content' ] = true
    }

    if (rowWidth === 'stretchedRowAndColumn' && removeSpaces) {
      classes.push('vce-row-no-paddings')
    }

    if (fullHeight) {
      classes.push('vce-row-full-height')
    } else {
      customRowProps.style.minHeight = ''
    }

    if (equalHeight) {
      contentClasses.push('vce-row-equal-height')
    }

    let className = classNames(classes)
    let contentClassName = classNames(contentClasses)

    let customId = metaCustomId === false ? id : metaCustomId

    return <div className='vce-row-container'>
      <div className={className} {...customRowProps} {...editor} id={customId}>
        <div className={contentClassName} id={'el-' + id} {...customProps}>
          {content}
        </div>
      </div>
    </div>
  }
}
