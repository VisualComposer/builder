import React from 'react'
import vcCake from 'vc-cake'
const vcvAPI = vcCake.getService('api')
import classNames from 'classnames'
import { setCssVariables } from 'vc-helpers'
export default class IconElement extends vcvAPI.elementComponent {
  render () {
    const { atts, editor, id } = this.props
    const { iconPicker, iconUrl, shape, iconAlignment, size, customClass, toggleCustomHover, metaCustomId, iconColor, iconColorHover, shapeColor, shapeColorHover, extraDataAttributes } = atts

    // Handle conditional classes
    const containerClasses = classNames({
      'vce-features vce-var-icon': true,
      [`vce-features--style-${shape}`]: shape,
      [`vce-features--size-${size}`]: size,
      [customClass]: typeof customClass === 'string' && customClass
    })
    const elementClasses = classNames({
      'vce-icon-container': true,
      [iconPicker.icon]: iconPicker.icon,
    })

    // Handle CSS variables
    const cssVars = { iconAlignment, iconColor, iconColorHover: iconColor, shapeColor, shapeColorHover: shapeColor }
    if (iconColorHover && toggleCustomHover) {
      cssVars.iconColorHover = iconColorHover
    }
    if (shapeColorHover && toggleCustomHover) {
      cssVars.shapeColorHover = shapeColorHover
    }
    const styleObj = setCssVariables(cssVars)

    // Handle tag & conditional props
    const containerProps = this.getExtraDataAttributes(extraDataAttributes);
    const { url, title, targetBlank, relNofollow } = iconUrl
    const linkProps = {
      href: url,
      title: title,
      target: targetBlank ? '_blank' : undefined,
      rel: relNofollow ? 'nofollow' : undefined
    }
    const hasShape = shape !== 'none'
    const CustomTag = url && hasShape ? 'a' : 'div';
    const CustomIconTag = url && !hasShape ? 'a' : 'span';
    const customProps = url && hasShape ? linkProps : {};
    const customIconProps = url && !hasShape ? linkProps : {};
    metaCustomId && (containerProps.id = metaCustomId)

    // Handle design options
    const doAll = this.applyDO('all')

    return (
      <div className={containerClasses} {...editor} {...containerProps}  style={styleObj}>
          <CustomTag id={'el-' + id} className='vce-features--icon vce-icon' {...customProps} {...doAll}>
            <svg xmlns='https://www.w3.org/2000/svg' viewBox='0 0 769 769'>
              <path strokeWidth='25' d='M565.755 696.27h-360l-180-311.77 180-311.77h360l180 311.77z' />
            </svg>
            <CustomIconTag className={elementClasses} {...customIconProps} />
          </CustomTag>
      </div>
    )
  }
}
