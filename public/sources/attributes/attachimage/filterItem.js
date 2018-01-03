import React from 'react'
import classNames from 'classnames'

const FilterItem = ({ active, filter, handleFilterChange, image }) => {
  let itemContentClasses = classNames({
    'vcv-ui-item-element-content': true,
    'vcv-ui-item-list-item-content--active': active
  })
  return (
    <li className='vcv-ui-item-list-item' onClick={() => { handleFilterChange(filter) }}>
      <span className='vcv-ui-item-element'>
        <span className={itemContentClasses}>
          <span className='vcv-ui-item-overlay'>
            <span className='vcv-ui-item-add vcv-ui-icon vcv-ui-icon-add' />
          </span>
        </span>
        <span className='vcv-ui-item-element-name'>
          <span>
            {filter}
          </span>
        </span>
      </span>
    </li>
  )
}

export default FilterItem
