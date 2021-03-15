import React from 'react'
import { getService } from 'vc-cake'
import classNames from 'classnames'

const Cook = getService('cook')
const vcvAPI = getService('api')

export default class HeroSectionElement extends vcvAPI.elementComponent {
  componentDidMount () {
    vcvAPI.publicEvents.trigger('heroSectionReady')
  }

  render () {
    let { id, atts, editor } = this.props
    let { description, backgroundImage, backgroundImagePosition, align, addButton, customClass, button, background, metaCustomId } = atts
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
      wrapperClasses = wrapperClasses.concat(' ' + customClass)
    }

    let rowStyles = {}
    if (background === 'image' && backgroundImage) {
      rowStyles.backgroundImage = `url(${this.getImageUrl(backgroundImage)})`
    } else if (background === 'color' && mixinData) {
      rowClasses.push(`vce-hero-section--background-color-${mixinData.selector}`)
    }

    mixinData = this.getMixinData('backgroundPosition')
    if (mixinData && backgroundImagePosition) {
      rowClasses.push(`vce-hero-section--background-position-${mixinData.selector}`)
    }

    let buttonOutput = ''
    if (addButton) {
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
}
