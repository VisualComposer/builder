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
    const { id, atts, editor } = this.props
    const { description, backgroundImage, backgroundImagePosition, backgroundColor, align, addButton, customClass, button, background, metaCustomId, extraDataAttributes } = atts
    const customProps = {}
    const containerProps = this.getExtraDataAttributes(extraDataAttributes)

    const containerClasses = classNames({
      'vce-hero-section-container': true,
      'vce-hero-section-media--xs': true
    })

    let wrapperClasses = classNames({
      vce: true,
      'vce-hero-section': true,
      'vce-hero-section--min-height': false,
      'vce-hero-section--alignment-start': align === 'start',
      'vce-hero-section--alignment-end': align === 'end'
    })

    let rowClasses = ['vce-hero-section--wrap-row']

    if (typeof customClass === 'string' && customClass) {
      wrapperClasses = wrapperClasses.concat(' ' + customClass)
    }

    const rowStyles = {}
    if (background === 'image' && backgroundImage) {
      rowStyles.backgroundImage = `url(${this.getImageUrl(backgroundImage)})`
    } else if (background === 'color') {
      const backgroundColorSelector = [...backgroundColor.matchAll(/[\da-f]+/gi)].map(match => match[0]).join('-')
      rowClasses.push(`vce-hero-section--background-color-${backgroundColorSelector}`)
    }

    if (backgroundImagePosition) {
      rowClasses.push(`vce-hero-section--background-position-${backgroundImagePosition.replace(' ', '-')}`)
    }

    let buttonOutput = ''
    if (addButton) {
      const Button = Cook.get(button)
      buttonOutput = Button ? Button.render(null, false) : null
    }

    if (metaCustomId) {
      containerProps.id = metaCustomId
    }

    rowClasses = classNames(rowClasses)

    const doRest = this.applyDO('margin background border animation')
    const doPadding = this.applyDO('padding')

    return (
      <section className={containerClasses} {...editor} {...containerProps}>
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
    )
  }
}
