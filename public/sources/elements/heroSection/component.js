/* global React, vcvAPI, vcCake */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  componentDidMount () {
    vcvAPI.publicEvents.trigger('heroSectionReady')
  }

  render () {
    let { id, atts, editor } = this.props
    let { description, image, align, addButton, customClass, designOptions, button, background, metaCustomId } = atts
    let classNames = require('classnames')
    let customProps = {}
    let containerProps = {}

    let containerClasses = classNames({
      'vce-hero-section-container': true,
      'vce-hero-section-media--xs': true
    })

    let wrapperClasses = classNames({
      'vce': true,
      'vce-hero-section': true,
      'vce-hero-section--min-height': false,
      'vce-hero-section--alignment-start': align === 'start',
      'vce-hero-section--alignment-end': align === 'end'
    })

    let rowClasses = ['vce-hero-section__wrap-row']

    let mixinData = this.getMixinData('backgroundColor')

    if (typeof customClass === 'string' && customClass) {
      wrapperClasses = containerClasses.concat(' ' + customClass)
    }

    let rowStyles = {}
    if (background === 'image' && image) {
      rowStyles.backgroundImage = `url(${this.getImageUrl(image)})`
    } else if (background === 'color' && mixinData) {
      rowClasses.push(`vce-hero-section--background-color-${mixinData.selector}`)
    }

    let buttonOutput = ''
    if (addButton) {
      const Cook = vcCake.getService('cook')
      let Button = Cook.get(button)
      buttonOutput = Button.render(null, false)
    }

    if (designOptions.device) {
      let animations = []
      Object.keys(designOptions.device).forEach((device) => {
        let prefix = (device === 'all') ? '' : device
        if (designOptions.device[ device ].animation) {
          if (prefix) {
            prefix = `-${prefix}`
          }
          animations.push(`vce-o-animate--${designOptions.device[ device ].animation}${prefix}`)
        }
      })
      if (animations.length) {
        customProps[ 'data-vce-animate' ] = animations.join(' ')
      }
    }
    if (metaCustomId) {
      containerProps.id = metaCustomId
    }

    rowClasses = classNames(rowClasses)

    let doRest = this.applyDO('margin background border')
    let doPadding = this.applyDO('padding')

    return <section className={containerClasses} {...editor} {...containerProps}>
      <div className={wrapperClasses} id={'el-' + id} {...doRest}>
        <div className={rowClasses} style={rowStyles} {...customProps}>
          <div className='vce-hero-section__wrap'>
            <div className='vce-hero-section__content' {...doPadding}>
              <div className='vce-hero-section__content-container'>
                {description}
              </div>
              {buttonOutput}
            </div>
          </div>
        </div>
      </div>
    </section>
  }

  getPublicImage (filename) {
    let assetsManager
    if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
      assetsManager = vcCake.getService('wipAssetsManager')
    } else {
      assetsManager = vcCake.getService('assets-manager')
    }
    let { tag } = this.props.atts
    return assetsManager.getPublicPath(tag, filename)
  }

  getImageUrl (image) {
    let imageUrl
    // Move it to attribute
    if (image && image.full) {
      imageUrl = image.full
    } else {
      imageUrl = this.getPublicImage(image)
    }
    return imageUrl
  }
}

