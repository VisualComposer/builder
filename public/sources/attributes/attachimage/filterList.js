import React from 'react'
import FilterItem from './filterItem'

const filters = [
  { value: 'normal', label: 'Normal' },
  { value: '1977', label: '1977' },
  { value: 'amaro', label: 'Amaro' },
  { value: 'brannan', label: 'Brannan' },
  { value: 'earlybird', label: 'Earlybird' },
  { value: 'hefe', label: 'Hefe' },
  { value: 'hudson', label: 'Hudson' },
  { value: 'inkwell', label: 'Inkwell' },
  { value: 'kelvin', label: 'Kelvin' },
  { value: 'lofi', label: 'Lo-Fi' },
  { value: 'mayfair', label: 'Mayfair' },
  { value: 'nashville', label: 'Nashville' },
  { value: 'rise', label: 'Rise' },
  { value: 'sierra', label: 'Sierra' },
  { value: 'sutro', label: 'Sutro' },
  { value: 'toaster', label: 'Toaster' },
  { value: 'valencia', label: 'Valencia' },
  { value: 'walden', label: 'Walden' },
  { value: 'willow', label: 'Willow' },
  { value: 'xpro2', label: 'X-PRO 2' }
]

class FilterList extends React.Component {
  render () {
    const { handleFilterChange, images, metaAssetsPath } = this.props
    let image = images.urls && images.urls[0] && images.urls[0]
    let filterName = image && image.filter || 'normal'
    return (
      <div className='vcv-ui-form-attach-image-filter-block'>
        <div className='vcv-ui-form-attach-image-filter-container'>
          <ul className='vcv-ui-form-attach-image-filter-list'>
            {filters.map((filter, index) => (
              <FilterItem
                key={index}
                filter={filter}
                active={filterName === filter.value}
                handleFilterChange={handleFilterChange}
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
