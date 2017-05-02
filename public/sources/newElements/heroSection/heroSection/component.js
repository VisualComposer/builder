import React from 'react'
import vcCake from 'vc-cake'
import classNames from 'classnames'

const Cook = vcCake.getService('cook')
const vcvAPI = vcCake.getService('api')

export default class HeroSectionElement extends vcvAPI.elementComponent {
  componentDidMount () {
    vcvAPI.publicEvents.trigger('heroSectionReady')
  }

  render () {
    let { id, atts, editor } = this.props
    let { description, image, align, addButton, customClass, button, background, metaCustomId } = atts
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

    let rowClasses = [ 'vce-hero-section--wrap-row' ]

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
      /** @var CookElement Button */
      let Button = Cook.get(button)
      buttonOutput = Button ? Button.render(null, false) : null
    }

    if (metaCustomId) {
      containerProps.id = metaCustomId
    }

    rowClasses = classNames(rowClasses)

    let doRest = this.applyDO('margin background border animation')
    let doPadding = this.applyDO('padding')

    return <section className={containerClasses} {...editor} {...containerProps}>
      <div className={wrapperClasses} id={'el-' + id} {...doRest}>
        <div className={rowClasses} style={rowStyles} {...customProps}>
          <div className='vce-hero-section--wrap'>
            <div className='vce-hero-section--content' {...doPadding}>
              <div className='vce-hero-section--content-container'>
                {description}
              </div>
              {buttonOutput}
            </div>
          </div>
        </div>
      </div>
    </section>
  }

  getImageUrl (image) {
    let imageUrl
    // Move it to attribute
    // TODO: Make sure to allow use also other sizes?
    if (image && image.full) {
      imageUrl = image.full
    } else {
      // It is string and it is default
      imageUrl = window.VCV_HUB_GET_ELEMENTS()[ this.props.atts.tag ].assetsPath + image
    }

    return imageUrl
  }
}
