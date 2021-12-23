import React from 'react'
import vcCake from 'vc-cake'
import { renderToStaticMarkup } from 'react-dom/server'

const vcvAPI = vcCake.getService('api')

export default class FaqToggle extends vcvAPI.elementComponent {
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
    const { shape, customHoverColors, metaCustomId, customClass } = atts

    let containerClasses = 'vce-faq-toggle'
    const customProps = {}

    if (typeof customClass === 'string' && customClass) {
      containerClasses += ' ' + customClass
    }

    let mixinData = this.getMixinData('color')

    if (mixinData) {
      containerClasses += ` vce-faq-toggle-color--${mixinData.selector}`
    }

    if (shape !== 'none') {
      mixinData = this.getMixinData('shapeColor')

      if (mixinData) {
        containerClasses += ` vce-faq-toggle-shape-color--${mixinData.selector}`
      }

      if (shape !== 'square') {
        containerClasses += ` vce-faq-toggle-shape--${shape}`
      }
    }

    if (customHoverColors) {
      mixinData = this.getMixinData('hoverColor')

      if (mixinData) {
        containerClasses += ` vce-faq-toggle-hover-color--${mixinData.selector}`
      }

      if (shape !== 'none') {
        mixinData = this.getMixinData('shapeHoverColor')

        if (mixinData) {
          containerClasses += ` vce-faq-toggle-shape-hover-color--${mixinData.selector}`
        }
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
