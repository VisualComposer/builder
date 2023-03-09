import React from 'react'
import vcCake from 'vc-cake'
import classNames from 'classnames'

const vcvAPI = vcCake.getService('api')

export default class BasicButtonComponent extends vcvAPI.elementComponent {
  render () {
    const { id, atts, editor } = this.props
    const { buttonUrl, buttonText, shape, alignment, customClass, toggleCustomHover, metaCustomId, size, toggleStretchButton, color, background, hoverColor, hoverBackground, extraDataAttributes } = atts

    const classes = classNames({
      'vce': true,
      'vce-button': true,
      'vce-basic-button': true,
      [customClass]: typeof customClass === 'string' && customClass,
      [`vce-basic-button--size-${size}`]: size
    })

    let customProps = this.getExtraDataAttributes(extraDataAttributes)
    metaCustomId && (customProps.id = metaCustomId)
    let CustomTag = 'button'
    const stylesVariables = {}

    if (buttonUrl && buttonUrl.url) {
      CustomTag = 'a'
      const { url, title, targetBlank, relNofollow } = buttonUrl
      customProps = {
        href: url,
        title: title,
        target: targetBlank ? '_blank' : undefined,
        rel: relNofollow ? 'nofollow' : undefined
      }
    }

    if (shape) {
      stylesVariables['--border-radius'] = shape
    }

    if (alignment) {
      stylesVariables['--text-align'] = alignment
    }

    if (toggleStretchButton) {
      stylesVariables['--button-width'] = '100%'
    }

    if (color) {
      stylesVariables['--color'] = color
      // By default make color darken by 10%
      stylesVariables['--hover-color'] = this.getColorShade(-0.1, color)
    }

    if (background) {
      stylesVariables['--background-color'] = background
      // By default make background color darken by 10%
      stylesVariables['--hover-background-color'] = this.getColorShade(-0.1, background)
    }

    if (toggleCustomHover && hoverColor) {
      stylesVariables['--hover-color'] = hoverColor
    }

    if (toggleCustomHover && hoverBackground) {
      stylesVariables['--hover-background-color'] = hoverBackground
    }

    const doAll = this.applyDO('all')

    return (
      <div className='vce-basic-button-container' {...editor} id={'el-' + id} style={stylesVariables}>
        <CustomTag className={classes} {...customProps} {...doAll}>
          {buttonText}
        </CustomTag>
      </div>
    )
  }
}
