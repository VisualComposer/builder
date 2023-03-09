import React from 'react'
import vcCake from 'vc-cake'
import classNames from 'classnames'
import { setCssVariables } from 'vc-helpers'

const vcvAPI = vcCake.getService('api')

export default class BasicButtonComponent extends vcvAPI.elementComponent {
  render () {
    const { id, atts, editor } = this.props
    const { buttonUrl, buttonText, shape, alignment, customClass, toggleCustomHover, metaCustomId, size, toggleStretchButton, color, background, hoverColor, hoverBackground, extraDataAttributes } = atts

    const classes = classNames({
      'vce vce-button vce-basic-button': true,
      [customClass]: typeof customClass === 'string' && customClass,
      [`vce-basic-button--size-${size}`]: size
    })

    let customProps = this.getExtraDataAttributes(extraDataAttributes)
    metaCustomId && (customProps.id = metaCustomId)
    let CustomTag = 'button'

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

    // Handle CSS variables
    const cssVars = {
      color,
      'hover-color': this.getColorShade(-0.1, color),
      'border-radius': shape,
      'text-align': alignment,
      'background-color': background,
      'hover-background-color': this.getColorShade(-0.1, background)
    }
    const styleObj = setCssVariables(cssVars)

    if (toggleStretchButton) {
      styleObj['--button-width'] = '100%'
    }

    if (toggleCustomHover && hoverColor) {
      styleObj['--hover-color'] = hoverColor
    }

    if (toggleCustomHover && hoverBackground) {
      styleObj['--hover-background-color'] = hoverBackground
    }

    const doAll = this.applyDO('all')

    return (
      <div className='vce-basic-button-container' {...editor} id={'el-' + id} style={styleObj}>
        <CustomTag className={classes} {...customProps} {...doAll}>
          {buttonText}
        </CustomTag>
      </div>
    )
  }
}
