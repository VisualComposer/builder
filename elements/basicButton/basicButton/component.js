import React from 'react'
import vcCake from 'vc-cake'
const vcvAPI = vcCake.getService('api')

export default class ButtonElement extends vcvAPI.elementComponent {
  render () {
    const { id, atts, editor } = this.props
    const { color, background, hoverColor, hoverBackground, buttonUrl, buttonText, shape, alignment, customClass, toggleCustomHover, metaCustomId, size, toggleStretchButton } = atts

    let containerClasses = 'vce-button--style-basic-container'
    let wrapperClasses = 'vce-button--style-basic-wrapper vce'
    let classes = 'vce-button--style-basic'
    let customProps = {}
    let CustomTag = 'button'

    const cssProperties = {}

    if (buttonUrl && buttonUrl.url) {
      CustomTag = 'a'
      let { url, title, targetBlank, relNofollow } = buttonUrl
      customProps = {
        'href': url,
        'title': title,
        'target': targetBlank ? '_blank' : undefined,
        'rel': relNofollow ? 'nofollow' : undefined
      }
    }

    if (typeof customClass === 'string' && customClass) {
      containerClasses += ' ' + customClass
    }

    if (shape) {
      const shapes = {
        square: '0',
        rounded: '5px',
        round: '4em'
      }
      cssProperties['--button-border-radius'] = shapes[shape]
    }

    if (alignment) {
      cssProperties['--button-align'] = alignment
    }

    if (size) {
      const sizes = {
        small: {
          font: '11px',
          padding: '10px 30px'
        },
        medium: {
          font: '16px',
          padding: '15px 43px'
        },
        large: {
          font: '21px',
          padding: '20px 56px'
        }
      }
      cssProperties['--button-size-padding'] = sizes[size].padding
      cssProperties['--button-size-font'] = sizes[size].font
    }

    if (toggleStretchButton) {
      cssProperties['--button-width'] = '100%'
    }

    if (color) {
      cssProperties['--button-color'] = color
    }

    if (background) {
      cssProperties['--button-background-color'] = background
    }

    if (toggleCustomHover && hoverColor) {
      cssProperties['--button-hover-color'] = hoverColor
    } else {
      cssProperties['--button-hover-color'] = color
    }

    if (toggleCustomHover && hoverBackground) {
      cssProperties['--button-hover-background-color'] = hoverBackground
    } else {
      cssProperties['--button-hover-background-color'] = this.lightenDarkenColor(background, -10)
    }

    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    let doMargin = this.applyDO('margin')
    let doRest = this.applyDO('padding border background animation')

    return <div className={containerClasses} {...editor} style={cssProperties}>
      <span className={wrapperClasses} id={'el-' + id} {...doMargin}>
        <CustomTag className={classes} {...customProps} {...doRest}>
          {buttonText}
        </CustomTag>
      </span>
    </div>
  }
}
