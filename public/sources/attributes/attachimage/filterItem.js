import React from 'react'
import classNames from 'classnames'

class FilterItem extends React.Component {
  getPublicImage (filename) {
    let { metaAssetsPath } = this.props
    if (!filename) {
      return ''
    }
    return filename.match('^(https?:)?\\/\\/?') ? filename : metaAssetsPath + filename
  }

  render () {
    const { active, filter, handleFilterChange, image } = this.props
    let itemContentClasses = classNames({
      'vcv-ui-form-attach-image-filter-content': true,
      'vcv-ui-form-attach-image-filter-content--active': active
    })
    let imageClasses = classNames([
      'vcv-ui-item-element-image',
      'vcv-ui-form-attach-image-filter-image',
      `vce-image-filter--${filter.value}`
    ])
    let imageUrl = this.getPublicImage(image.full)
    return (
      <li className='vcv-ui-form-attach-image-filter-list-item' onClick={() => { handleFilterChange(filter.value) }}>
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
