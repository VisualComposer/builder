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

    const wrapperClasses = classNames({
      vce: true,
      'vce-hero-section': true,
      'vce-hero-section--min-height': false,
      'vce-hero-section--alignment-start': align === 'start',
      'vce-hero-section--alignment-end': align === 'end',
      [`${customClass}`]: typeof customClass === 'string' && customClass
    })

    if (metaCustomId) {
      containerProps.id = metaCustomId
    }

    const doRest = this.applyDO('margin background border animation')
    const doPadding = this.applyDO('padding')

    return (
      <section className={containerClasses} {...editor} {...containerProps}>
        <div className={wrapperClasses} id={'el-' + id} {...doRest}>
          <div className='vce-hero-section--wrap-row' {...customProps}>
            <div className='vce-hero-section--wrap'>
              <div className='vce-hero-section--content' {...doPadding}>
                <div className='vce-hero-section--content-container'>
                  {description}
                </div>
                {children}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}
