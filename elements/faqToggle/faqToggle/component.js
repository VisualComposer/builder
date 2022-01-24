import React from 'react'
import vcCake from 'vc-cake'
import { renderToStaticMarkup } from 'react-dom/server'

const vcvAPI = vcCake.getService('api')

export default class FaqToggle extends vcvAPI.elementComponent {
  getColorSelector (color) {
    return [...color.matchAll(/[\da-f]+/gi)].map(match => match[0]).join('-')
  }

  getContent () {
    const { atts } = this.props
    const { textBlock, titleText, elementTag } = atts
    const CustomTag = elementTag

    return (
      <div className='vce-faq-toggle-inner'>
        <div className='vce-faq-toggle-title'>
          <CustomTag className='vce-faq-toggle-title-text' aria-controls={`${atts.tag}-${this.props.id}`} aria-expanded='false'>
            <i className='vce-faq-toggle-icon' />
            {titleText}
          </CustomTag>
        </div>
        <div className='vce-faq-toggle-text-block' role='region' id={`${atts.tag}-${this.props.id}`}>{textBlock}</div>
      </div>
    )
  }

  render () {
    const { id, atts, editor } = this.props
    const { shape, customHoverColors, metaCustomId, customClass, iconColor, shapeColor, iconHoverColor, shapeHoverColor } = atts

    let containerClasses = 'vce-faq-toggle'
    const customProps = {}

    if (typeof customClass === 'string' && customClass) {
      containerClasses += ' ' + customClass
    }

    containerClasses += ` vce-faq-toggle-color--${this.getColorSelector(iconColor)}`

    if (shape !== 'none') {
      containerClasses += ` vce-faq-toggle-shape-color--${this.getColorSelector(shapeColor)}`

      if (shape !== 'square') {
        containerClasses += ` vce-faq-toggle-shape--${shape}`
      }
    }

    if (customHoverColors) {
      containerClasses += ` vce-faq-toggle-hover-color--${this.getColorSelector(iconHoverColor)}`

      if (shape !== 'none') {
        containerClasses += ` vce-faq-toggle-shape-hover-color--${this.getColorSelector(shapeHoverColor)}`
      }
    }

    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    const doAll = this.applyDO('margin padding border background animation')

    const content = this.getContent()
    const stringContent = renderToStaticMarkup(content)

    return (
      <div className={containerClasses} {...editor} {...customProps}>
        <div className='vce-faq-toggle-wrapper vce' id={'el-' + id} {...doAll}>
          <div className='vcvhelper' data-vcvs-html={stringContent}>
            {content}
          </div>
        </div>
      </div>
    )
  }
}
