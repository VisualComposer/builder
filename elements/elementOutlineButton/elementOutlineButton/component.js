import React from 'react'
import vcCake from 'vc-cake'
import classNames from 'classnames'
import { setCssVariables } from 'vc-helpers'

const vcvAPI = vcCake.getService('api')

export default class OutlineButtonElement extends vcvAPI.elementComponent {
  getColorSelector (colors) {
    const selector = colors.map(color => {
      return [...color.matchAll(/[\da-f]+/gi)].map(match => match[0]).join('-') || 'empty'
    })
    return selector.join('--')
  }

  render () {
    const { id, atts, editor } = this.props
    const {
      buttonUrl,
      buttonText,
      shape,
      alignment,
      customClass,
      buttonType,
      metaCustomId,
      size,
      toggleStretchButton,
      color,
      hoverColorAnimated,
      hoverColorOutline,
      borderColor,
      hoverBorder,
      hoverBackground,
      extraDataAttributes
    } = atts

    // Handle conditional classes
    const classes = classNames({
      'vce vce-button': true,
      'vce-button-outline': true,
      [`vce-button-outline--${buttonType}`]: buttonType,
      [`vce-button-outline--size-${size}`]: size,
      [customClass]: typeof customClass === 'string' && customClass
    })

    let customProps = this.getExtraDataAttributes(extraDataAttributes)
    metaCustomId && (customProps.id = metaCustomId)
    let CustomTag = 'button'
    // const buttonCustomClass = buttonType ? `vce-button--style-${buttonType}` : 'vce-button--style-outline'
    // classes.push(buttonCustomClass)

    if (buttonUrl && buttonUrl.url) {
      CustomTag = 'a'
      const { url, title, targetBlank, relNofollow } = buttonUrl
      customProps.href = url
      customProps.title = title
      customProps.target = targetBlank ? '_blank' : undefined
      customProps.rel = relNofollow ? 'nofollow' : undefined
    }

    // Handle CSS variables
    const cssVars = {
      color,
      // 'hover-color': this.getColorShade(-0.1, color),
      // 'background-color': background,
      // 'hover-background-color': this.getColorShade(-0.1, background),
      'border-radius': shape,
      'text-align': alignment
    }
    const styleObj = setCssVariables(cssVars)

    if (toggleStretchButton) {
      styleObj['--button-width'] = '100%'
    }

    // classes.push(`${buttonCustomClass}--color-${this.getColorSelector([color, hoverColorAnimated, hoverColorOutline])}`)
    // classes.push(`${buttonCustomClass}--border-color-${this.getColorSelector([borderColor, hoverBorder])}`)
    // classes.push(`${buttonCustomClass}--background-color-${this.getColorSelector([hoverBackground])}`)

    const doAll = this.applyDO('all')

    return (
      <div className='vce-button-outline-container' {...editor} id={'el-' + id} style={styleObj}>
        <CustomTag className={classes} {...customProps} {...doAll}>
            <span className='vce-button-outline-text'>
              {buttonText}
            </span>
        </CustomTag>
      </div>
    )
  }
}
