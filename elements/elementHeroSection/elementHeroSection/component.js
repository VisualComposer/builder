import React from 'react'
import { getService } from 'vc-cake'
import classNames from 'classnames'

const vcvAPI = getService('api')

export default class HeroSectionElement extends vcvAPI.elementComponent {
  componentDidMount () {
    vcvAPI.publicEvents.trigger('heroSectionReady')
  }

  render () {
    const { id, atts, editor, children } = this.props
    const { description, align, customClass, metaCustomId, extraDataAttributes } = atts
    const customProps = {}
    const containerProps = this.getExtraDataAttributes(extraDataAttributes)

    const containerClasses = classNames({
      'vce-hero-section-container': true,
      'vce-hero-section-media--xs': true
    })

    let elementClasses = classNames({
      vce: true,
      'vce-hero-section': true,
      'vce-hero-section--alignment-start': align === 'start',
      'vce-hero-section--alignment-end': align === 'end'
    })

    if (typeof customClass === 'string' && customClass) {
      elementClasses = elementClasses.concat(' ' + customClass)
    }

    if (metaCustomId) {
      containerProps.id = metaCustomId
    }

    const doRest = this.applyDO('margin background border animation')
    const doPadding = this.applyDO('padding')

    return (
      <section className={containerClasses} {...editor} {...containerProps}>
        <div className={elementClasses} id={'el-' + id} {...doRest} {...customProps}>
          <div className="vce-hero-section--content" {...doPadding}>
            {description}
            {children}
          </div>
        </div>
      </section>
    )
  }
}
