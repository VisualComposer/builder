/* global React, vcvAPI */
class Component extends vcvAPI.elementComponent {
  render () {
    let classes = 'vce-features'
    let {atts, editor, id} = this.props
    let {iconPicker, iconColor, shapeColor, iconUrl, shape, iconAlignment, size, customClass, designOptions, toggleCustomHover} = atts
    let customProps = {}
    let CustomTag = 'div'
    let { url, title, targetBlank, relNofollow } = iconUrl
    let iconClasses = 'vce-icon-container' + ` ${iconPicker.icon}`

    if (url) {
      CustomTag = 'a'
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

    if (typeof customClass === 'string' && customClass) {
      classes += ' ' + customClass
    }

    let mixinData = this.getMixinData('iconColor')

    if (mixinData) {
      classes += ` vce-icon--style--icon-color-${mixinData.selector}`
    }

    mixinData = this.getMixinData('shapeColor')

    if (mixinData) {
      classes += ` vce-icon--style--shape-color-${mixinData.selector}`
    }

    mixinData = this.getMixinData('iconColorHover')

    if (mixinData && toggleCustomHover) {
      classes += ` vce-icon--style--icon-color-hover-${mixinData.selector}`
    }

    mixinData = this.getMixinData('shapeColorHover')

    if (mixinData && toggleCustomHover) {
      classes += ` vce-icon--style--shape-color-hover-${mixinData.selector}`
    }

    return <div className={classes}>
      <CustomTag className='vce-features__icon vce-icon vce' id={'el-' + id} {...editor} {...customProps}>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 769 769'>
          <path strokeWidth='40' d='M565.755 696.27h-360l-180-311.77 180-311.77h360l180 311.77z' />
        </svg>
        <span className={iconClasses} />
      </CustomTag>
    </div>
  }
}

