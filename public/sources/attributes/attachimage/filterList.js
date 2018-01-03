import React from 'react'
import FilterItem from './filterItem'

const filters = [
  'normal',
  '1977',
  'amaro',
  'brannan',
  'earlybird',
  'hefe',
  'hudson',
  'inkwell',
  'kelvin',
  'lofi',
  'mayfair',
  'nashville',
  'rise',
  'sierra',
  'sutro',
  'toaster',
  'valencia',
  'walden',
  'willow',
  'xpro2'
]

class FilterList extends React.Component {
  render () {
    const { handleFilterChange, images } = this.props
    let image = images.urls && images.urls[0] && images.urls[0]
    let filterName = image && image.filter || 'normal'
    return (
      <div className='vcv-ui-replace-element-block'>
        <div className='vcv-ui-replace-element-container'>
          <ul className='vcv-ui-replace-element-list'>
            {filters.map((filter, index) => (
              <FilterItem key={index} filter={filter} active={filterName === filter} handleFilterChange={handleFilterChange} image={image} />
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default FilterList
