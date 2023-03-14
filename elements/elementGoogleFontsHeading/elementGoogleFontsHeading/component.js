import React from 'react'
import vcCake from 'vc-cake'
import classNames from 'classnames'
import { setCssVariables } from 'vc-helpers'
const vcvAPI = vcCake.getService('api')

export default class GoogleFontsHeadingElement extends vcvAPI.elementComponent {
  validateAndFormatSize (value) {
    const units = ['px', 'em', 'rem', '%', 'vw', 'vh']
    const re = new RegExp(`^-?\\d*(\\.\\d{0,9})?(${units.join('|')})?$`)
    if (re.test(value)) {
      if (/^\d+$/.test(value)) {
        return `${value}px`
      } else {
        return value
      }
    }
    return null
  }

  render () {
    const { id, atts, editor } = this.props
    const { text, elementTag, font, fontSize, alignment, lineHeight, letterSpacing, link, colorType, customClass, metaCustomId, color, gradientStart, gradientEnd, gradientAngle, extraDataAttributes } = atts

    // Handle conditional classes
    const containerClasses = classNames({
      'vce-google-fonts-heading-container': true,
      [`vce-google-fonts-heading--${colorType}`]: colorType,
      [customClass]: typeof customClass === 'string' && customClass
    })

    // Handle css variables
    const cssVars = { fontFamily: font.fontFamily, alignment, color, gradientStart, gradientEnd, gradientAngleDeg: `${gradientAngle}deg` }
    cssVars.fontSize = this.validateAndFormatSize(fontSize)
    cssVars.lineHeight = this.validateAndFormatSize(lineHeight)
    cssVars.letterSpacing = this.validateAndFormatSize(letterSpacing)
    if (font && font.status === 'active') {
      const fontStyle = font.fontStyle ? (font.fontStyle.style === 'regular' ? 'normal' : font.fontStyle.style) : 'normal'
      cssVars.fontWeight = font.fontStyle ? font.fontStyle.weight : 400
      cssVars.fontStyle = fontStyle
    }
    const styleObj = setCssVariables(cssVars)

    // Handle Custom Tag
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

    // Handle conditional props
    const containerProps = this.getExtraDataAttributes(extraDataAttributes)
    metaCustomId && (containerProps.id = metaCustomId)

    // Handle design options
    const doAll = this.applyDO('border background animation padding margin')

    return (
      <div {...containerProps} className={containerClasses} {...editor} style={styleObj}>
        <CustomTag id={'el-' + id} className='vce-google-fonts-heading-content' {...doAll}>
          {headingHtml}
        </CustomTag>
      </div>
    )
  }
}
