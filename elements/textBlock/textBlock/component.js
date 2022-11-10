import React from 'react'
import vcCake from 'vc-cake'

const vcvAPI = vcCake.getService('api')

export default class TextBlockElement extends vcvAPI.elementComponent {
  constructor (props) {
    super(props)
    this.updateElementAssets = this.updateElementAssets.bind(this)
  }

  updateElementAssets (data, source, options) {
    this.updateElementAssetsWithExclusion(this.props.id, options, ['output', 'customClass', 'metaCustomId'])
  }

  render () {
    const { id, atts, editor } = this.props
    const { output, customClass, metaCustomId, extraDataAttributes } = atts // destructuring assignment for attributes from settings.json with access public
    let textBlockClasses = 'vce-text-block'
    const wrapperClasses = 'vce-text-block-wrapper vce'
    const customProps = this.getExtraDataAttributes(extraDataAttributes)
    if (typeof customClass === 'string' && customClass) {
      textBlockClasses = textBlockClasses.concat(' ' + customClass)
    }

    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    const doAll = this.applyDO('all')

    return (
      <div className={textBlockClasses} {...editor} {...customProps}>
        <div className={wrapperClasses} id={'el-' + id} {...doAll}>
          {output}
        </div>
      </div>
    )
  }
}
