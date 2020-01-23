import React from 'react'
import classNames from 'classnames'
import { env, getService } from 'vc-cake'

const { getBlockRegexp } = getService('utils')
const { getDynamicFieldsData } = getService('cook').dynamicFields
const blockRegexp = getBlockRegexp()

class FilterItem extends React.Component {
  getPublicImage (filename) {
    const { metaAssetsPath } = this.props
    if (!filename) {
      return ''
    }
    const isDynamic = env('VCV_JS_FT_DYNAMIC_FIELDS')
    if (isDynamic && filename.match(blockRegexp)) {
      const blockInfo = filename.split(blockRegexp)
      const blockAtts = JSON.parse(blockInfo[4])
      filename = getDynamicFieldsData({
        blockAtts: blockAtts
      })

      return filename
    }
    return filename.match('^(https?:)?\\/\\/?') ? filename : metaAssetsPath + filename
  }

  render () {
    const { active, filter, image } = this.props
    const itemContentClasses = classNames({
      'vcv-ui-form-attach-image-filter-content': true,
      'vcv-ui-form-attach-image-filter-content--active': active
    })
    const imageClasses = classNames([
      'vcv-ui-item-element-image',
      'vcv-ui-form-attach-image-filter-image',
      `vce-image-filter--${filter.value}`
    ])
    const imageUrl = this.getPublicImage(image.full)
    return (
      <li className='vcv-ui-form-attach-image-filter-list-item' onClick={() => { this.props.onFilterChange(filter.value) }}>
        <span className='vcv-ui-form-attach-image-filter'>
          <span className={itemContentClasses}>
            <img className={imageClasses} src={imageUrl} />
            <span className='vcv-ui-item-overlay'>
              <span className='vcv-ui-item-add vcv-ui-icon vcv-ui-icon-add' />
            </span>
          </span>
          <span className='vcv-ui-form-attach-image-filter-name '>
            <span>
              {filter.label}
            </span>
          </span>
        </span>
      </li>
    )
  }
}

export default FilterItem
