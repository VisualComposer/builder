import React from 'react'
import vcCake from 'vc-cake'
import pSBC from './tools'
const vcvAPI = vcCake.getService('api')

export default class IconElement extends vcvAPI.elementComponent {
  render () {
    let classes = 'vce-features vce-var-icon'
    const { atts, editor, id } = this.props
    const { iconPicker, iconUrl, shape, iconAlignment, size, customClass, toggleCustomHover, metaCustomId, iconColor, iconColorHover, shapeColor, shapeColorHover, extraDataAttributes } = atts
    let customProps = {}
    const containerProps = this.getExtraDataAttributes(extraDataAttributes)
    let customIconProps = {}
    let CustomTag = 'div'
    let CustomIconTag = 'span'
    const { url, title, targetBlank, relNofollow } = iconUrl
    const iconClasses = `vce-icon-container ${iconPicker.icon}`
    const stylesVariables = {}

    if (url) {
      if (shape !== 'none') {
        CustomTag = 'a'
        customProps = {
          href: url,
          title: title,
          target: targetBlank ? '_blank' : undefined,
          rel: relNofollow ? 'nofollow' : undefined
        }
      } else {
        CustomIconTag = 'a'
        customIconProps = {
          href: url,
          title: title,
          target: targetBlank ? '_blank' : undefined,
          rel: relNofollow ? 'nofollow' : undefined
        }
      }
    } else {
      CustomTag = 'div'
      CustomIconTag = 'span'
    }

    if (shape) {
      classes += ` vce-features--style-${shape}`
    }

    if (size) {
      classes += ` vce-features--size-${size}`
    }

    if (typeof customClass === 'string' && customClass) {
      classes += ' ' + customClass
    }

    if (iconAlignment) {
      stylesVariables['--text-align'] = iconAlignment
    }

    if (iconColor) {
      stylesVariables['--iconColor'] = iconColor
      stylesVariables['--iconColorHover'] = iconColor
    }

    if (shapeColor) {
      stylesVariables['--shapeColor'] = shapeColor
      stylesVariables['--shapeColorHover'] = shapeColor
      stylesVariables['--linkColorHover'] = pSBC(-0.2, shapeColor)
    }

    if (iconColorHover && toggleCustomHover) {
      stylesVariables['--iconColorHover'] = iconColorHover
    }

    if (shapeColorHover && toggleCustomHover) {
      stylesVariables['--shapeColorHover'] = shapeColorHover
      stylesVariables['--linkColorHover'] = shapeColorHover
    }

    if (metaCustomId) {
      containerProps.id = metaCustomId
    }

    const doAll = this.applyDO('all')

    return (
      <div className={classes} {...editor} {...containerProps} style={stylesVariables}>
        <div id={'el-' + id} className='vce vce-features-icon-wrapper' {...doAll}>
          <CustomTag className='vce-features--icon vce-icon' {...customProps}>
            <svg xmlns='https://www.w3.org/2000/svg' viewBox='0 0 769 769'>
              <path strokeWidth='25' d='M565.755 696.27h-360l-180-311.77 180-311.77h360l180 311.77z' />
            </svg>
            <CustomIconTag className={iconClasses} {...customIconProps} />
          </CustomTag>
        </div>
      </div>
    )
  }
}
