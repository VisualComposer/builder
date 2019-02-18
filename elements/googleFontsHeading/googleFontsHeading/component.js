import React from 'react'
import vcCake from 'vc-cake'

const vcvAPI = vcCake.getService('api')

export default class GoogleFontsHeadingElement extends vcvAPI.elementComponent {
  validateSize (value) {
    let units = [ 'px', 'em', 'rem', '%', 'vw', 'vh' ]
    let re = new RegExp('^-?\\d*(\\.\\d{0,9})?(' + units.join('|') + ')?$')
    if (value === '' || value.match(re)) {
      return value
    } else {
      return null
    }
  }

  render () {
    let { id, atts, editor } = this.props
    let { text, elementTag, font, fontSize, alignment, lineHeight, letterSpacing, link, colorType, customClass, metaCustomId } = atts
    let classes = 'vce-google-fonts-heading'
    let wrapperClasses = 'vce-google-fonts-heading-wrapper'
    let customProps = {}
    let innerClasses = 'vce-google-fonts-heading-inner'
    let backgroundClasses = 'vce-google-fonts-heading--background vce'
    let innerCustomProps = {}
    innerCustomProps.style = {}
    let CustomTag = elementTag
    let headingHtml = text

    if (link && link.url) {
      let { url, title, targetBlank, relNofollow } = link
      let linkProps = {
        'href': url,
        'title': title,
        'target': targetBlank ? '_blank' : undefined,
        'rel': relNofollow ? 'nofollow' : undefined
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

    let mixinData = this.getMixinData('textColor')

    if (mixinData) {
      switch (colorType) {
        case 'gradient':
          classes += ` vce-google-fonts-heading--gradient-${mixinData.selector}`
          break
        case 'color':
          classes += ` vce-google-fonts-heading--color-${mixinData.selector}`
          break
        default:
          console.warn('There was an issue assigning color type!')
      }
    }

    if (font && font.status === 'active') {
      let fontStyle = font.fontStyle ? (font.fontStyle.style === 'regular' ? null : font.fontStyle.style) : null
      innerCustomProps.style.fontFamily = font.fontFamily
      innerCustomProps.style.fontWeight = font.fontStyle ? font.fontStyle.weight : null
      innerCustomProps.style.fontStyle = fontStyle
    }

    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    let doAll = this.applyDO('border background animation padding margin')

    return <div {...customProps} className={classes} {...editor}>
      <div className={wrapperClasses}>
        <div className={backgroundClasses} id={'el-' + id} {...doAll}>
          <CustomTag className={innerClasses} {...innerCustomProps}>
            {headingHtml}
          </CustomTag>
        </div>
      </div>
    </div>
  }
}
