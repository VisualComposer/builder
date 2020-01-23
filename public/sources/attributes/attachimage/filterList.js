import React from 'react'
import FilterItem from './filterItem'
import filters from './filters'

class FilterList extends React.Component {
  render () {
    const { images, metaAssetsPath } = this.props
    const image = images.urls && images.urls[0] ? images.urls[0] : ''
    const filterName = image && image.filter ? image.filter : 'normal'
    return (
      <div className='vcv-ui-form-attach-image-filter-block'>
        <div className='vcv-ui-form-attach-image-filter-container'>
          <ul className='vcv-ui-form-attach-image-filter-list'>
            {filters.map((filter, index) => (
              <FilterItem
                key={index}
                filter={filter}
                active={filterName === filter.value}
                onFilterChange={this.props.onFilterChange}
                image={image}
                metaAssetsPath={metaAssetsPath}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default FilterList
