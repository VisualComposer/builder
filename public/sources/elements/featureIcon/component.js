/* global React, vcvAPI */
class Component extends vcvAPI.elementComponent {
  render () {
    let classes = 'vce-features'
    let {atts, editor, id} = this.props
    let {iconPicker, iconColor, iconUrl, shape, iconAlignment, size, customClass, designOptions} = atts
    let customProps = {}
    let customTag = 'i'
    let tinycolor = require('react-color/modules/tinycolor2')
    let colorValue = tinycolor(iconColor).toRgbString()

    if (iconUrl) {
      customTag = 'a'
      let { url, title, targetBlank, relNofollow } = iconUrl
      customProps = {
        'href': url,
        'title': title,
        'target': targetBlank ? '_blank' : undefined,
        'rel': relNofollow ? 'nofollow' : undefined
      }
    }

    if (shape) {
      classes += ` vce-features--style-${shape}`
    }

    if (iconAlignment) {
      classes += ` vce-features--align-${iconAlignment}`
    }

    if (size) {
      classes += ` vce-features--size-${size}`
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

    if (typeof customClass === 'string' && this.props.atts.customClass) {
      classes += classes.concat(' ' + this.props.atts.customClass)
    }

    return <div className={classes}>
      <div className='vce-features__icon vce-icon vce' id={'el-' + id} {...editor}>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 769 769'>
          <path strokeWidth='40' d='M565.755 696.27h-360l-180-311.77 180-311.77h360l180 311.77z' />
        </svg>
        <span className={iconPicker} style={{ iconColor: colorValue }} />
      </div>
    </div>
  }
}

