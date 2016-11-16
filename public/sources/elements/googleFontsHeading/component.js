/* global React, vcvAPI */
/*eslint no-unused-vars: 0*/
class Component extends vcvAPI.elementComponent {
  componentDidMount () {

  }

  componentWillReceiveProps (nextProps) {

  }

  render () {
    let { id, atts, editor } = this.props
    let { designOptions, text, font, elementTag, fontSize, alignment, lineHeight, link, customClass } = atts
    let classes = 'vce-google-fonts-heading vce'
    let customProps = {}
    let innerClasses = 'vce-google-fonts-heading-inner'
    let innerCustomProps = {}
    let CustomTag = elementTag
    let headingHtml = text

    if (link && link.url) {
      CustomTag = 'a'
      let { url, title, targetBlank, relNofollow } = link
      customProps = {
        'href': url,
        'title': title,
        'target': targetBlank ? '_blank' : undefined,
        'rel': relNofollow ? 'nofollow' : undefined
      }
    }

    if (typeof customClass === 'string' && customClass) {
      classes += ' ' + customClass
    }

    if (fontSize) {

    }

    if (alignment) {
      classes += ` vce-google-fonts-heading--align-${alignment}`
    }

    let mixinData = this.getMixinData('textColor')

    if (mixinData) {
      classes += ` vce-google-fonts-heading--color-${mixinData.selector}`
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

    return <div {...customProps} className={classes} id={'el-' + id} {...editor}>
      <CustomTag className={innerClasses} {...innerCustomProps}>
        {headingHtml}
      </CustomTag>
    </div>
  }
}
