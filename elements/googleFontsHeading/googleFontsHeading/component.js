import React from 'react'
import vcCake from 'vc-cake'

const vcvAPI = vcCake.getService('api')

export default class GoogleFontsHeadingElement extends vcvAPI.elementComponent {
  getColorSelector (color) {
    return [...color.matchAll(/[\da-f]+/gi)].map(match => match[0]).join('-')
  }

  validateSize (value) {
    const units = ['px', 'em', 'rem', '%', 'vw', 'vh']
    const re = new RegExp('^-?\\d*(\\.\\d{0,9})?(' + units.join('|') + ')?$')
    if (value === '' || value.match(re)) {
      return value
    } else {
      return null
    }
  }

  render () {
    const { id, atts, editor } = this.props
    let { text, elementTag, font, fontSize, alignment, lineHeight, letterSpacing, link, colorType, customClass, metaCustomId, color, gradientStart, gradientEnd, gradientAngle } = atts
    let classes = 'vce-google-fonts-heading'
    const wrapperClasses = 'vce-google-fonts-heading-wrapper'
    const customProps = {}
    const innerClasses = 'vce-google-fonts-heading-inner'
    const backgroundClasses = 'vce-google-fonts-heading--background vce'
    const innerCustomProps = {}
    innerCustomProps.style = {}
    const CustomTag = elementTag
    let headingHtml = text

    if (link && link.url) {
      const { url, title, targetBlank, relNofollow } = link
      const linkProps = {
        href: url,
        title: title,
        target: targetBlank ? '_blank' : undefined,
        rel: relNofollow ? 'nofollow' : undefined
      }

      headingHtml = (
        <a className='vce-google-fonts-heading-link' {...linkProps}>
          {headingHtml}
        </a>
      )
    }

    if (typeof customClass === 'string' && customClass) {
      classes += ' ' + customClass
    }

    if (fontSize) {
      fontSize = this.validateSize(fontSize)

      if (fontSize) {
        fontSize = /^\d+$/.test(fontSize) ? fontSize + 'px' : fontSize
        innerCustomProps.style.fontSize = fontSize
      }
    }

    if (lineHeight) {
      lineHeight = this.validateSize(lineHeight)

      if (lineHeight) {
        innerCustomProps.style.lineHeight = lineHeight
      }
    }

    if (letterSpacing) {
      letterSpacing = this.validateSize(letterSpacing)

      if (letterSpacing) {
        letterSpacing = /^\d+$/.test(letterSpacing) ? letterSpacing + 'px' : letterSpacing
        innerCustomProps.style.letterSpacing = letterSpacing
      }
    }

    if (alignment) {
      classes += ` vce-google-fonts-heading--align-${alignment}`
    }

    const colorSelector = color ? this.getColorSelector(color) : 'empty'
    const gradientStartSelector = this.getColorSelector(gradientStart)
    const gradientEndSelector = this.getColorSelector(gradientEnd)
    const fontColorSelector = `${colorSelector}--${gradientAngle}--${gradientEndSelector}--${gradientStartSelector}`

    classes += ` vce-google-fonts-heading--${colorType}-${fontColorSelector}`
    classes += ` vce-google-fonts-heading--font-family-${font.fontFamily.replace(' ', '-')}`

    if (font && font.status === 'active') {
      const fontStyle = font.fontStyle ? (font.fontStyle.style === 'regular' ? 'normal' : font.fontStyle.style) : 'normal'
      innerCustomProps.style.fontWeight = font.fontStyle ? font.fontStyle.weight : 400
      innerCustomProps.style.fontStyle = fontStyle
    }

    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    const doAll = this.applyDO('border background animation padding margin')

    return (
      <div {...customProps} className={classes} {...editor}>
        <div className={wrapperClasses}>
          <div className={backgroundClasses} id={'el-' + id} {...doAll}>
            <CustomTag className={innerClasses} {...innerCustomProps}>
              {headingHtml}
            </CustomTag>
          </div>
        </div>
      </div>
    )
  }
}
