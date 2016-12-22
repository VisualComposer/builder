/* global React, vcvAPI */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
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
    let { designOptions, text, font, elementTag, fontSize, alignment, lineHeight, link, customClass } = atts
    let classes = 'vce-google-fonts-heading'
    let wrapperClasses = 'vce-google-fonts-heading-wrapper'
    let customProps = {}
    let innerClasses = 'vce-google-fonts-heading-inner vce'
    let innerCustomProps = {}
    innerCustomProps.style = {}
    let CustomTag = elementTag
    let headingHtml = text
    let googleFontLink = ''

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

    if (alignment) {
      classes += ` vce-google-fonts-heading--align-${alignment}`
    }

    let mixinData = this.getMixinData('textColor')

    if (mixinData) {
      classes += ` vce-google-fonts-heading--color-${mixinData.selector}`
    }

    if (font) {
      let fontStyle = font.fontStyle ? (font.fontStyle.style === 'regular' ? '' : font.fontStyle.style) : null
      let fontHref = ''

      if (font.fontStyle) {
        fontHref = `https://fonts.googleapis.com/css?family=${font.fontFamily}:${font.fontStyle.weight + fontStyle}`
      } else {
        fontHref = `https://fonts.googleapis.com/css?family=${font.fontFamily}`
      }

      googleFontLink = (
        <link href={fontHref} rel='stylesheet' />
      )

      innerCustomProps.style.fontFamily = font.fontFamily
      innerCustomProps.style.fontWeight = font.fontStyle ? font.fontStyle.weight : null
      innerCustomProps.style.fontStyle = fontStyle
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

    return <div {...customProps} className={classes} {...editor}>
      <div className={wrapperClasses}>
        <vcvhelper>{googleFontLink}</vcvhelper>
        <CustomTag className={innerClasses} {...innerCustomProps} id={'el-' + id}>
          {headingHtml}
        </CustomTag>
      </div>
    </div>
  }
}
