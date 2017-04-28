/* global React, vcvAPI */
/*eslint no-unused-vars: 0*/
class Component extends vcvAPI.elementComponent {
  render () {
    var { id, atts, editor } = this.props
    var { buttonText, shape, animate, color, background, designOptions } = atts

    let classes = 'vce-button-xo'
    let buttonHtml = buttonText
    let customProps = {}

    if (shape && shape !== 'square') {
      classes += ` vce-button-xo--border-${shape}`
    }

    classes += ` vce-button-xo--style-flat`

    let mixinData = this.getMixinData('flatColor')

    if (mixinData) {
      classes += ` vce-button-xo--style-flat--color-${mixinData.selector}`
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
    if (animations.length) {
      customProps[ 'data-vce-animate' ] = animations.join(' ')
    }

    return (
      <div className='vce-button-container vce' id={'el-' + id} {...editor}>
        <button className={classes} {...customProps}>
          {buttonHtml}
        </button>
      </div>
    )
  }
}
