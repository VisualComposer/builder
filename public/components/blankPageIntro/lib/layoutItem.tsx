import React, { useState } from 'react'
import classNames from 'classnames'
import { getService } from 'vc-cake'
// @ts-ignore
import Tooltip from 'public/components/tooltip/tooltip'

const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')

interface Props {
  isSelectable: boolean,
  itemData: any
}

const LayoutItem: React.FC<Props> = ({isSelectable, itemData}) => {
  const [isSelected, setIsSelected] = useState(false)

  const handleItemClick = () => {
    setIsSelected(!isSelected)
  }

  const itemClasses = classNames({
    'template-item': true,
    'template-item--selected': isSelected
  })
  let item = (
    <div className={itemClasses} onClick={handleItemClick}>
      <div className='template-thumbnail' />
      <div className='template-info'>
        <span className='template-label'>{itemData.label}</span>
        <Tooltip />
        <i className='vcv-ui-icon vcv-ui-icon-checked-circle' />
      </div>
    </div>
  )
  if (isSelectable) {
    item = (
      <div className='template-item'>
        <div className='template-thumbnail' />
        <div className='template-info'>
          <span className='template-label'>{itemData.label}</span>
          <select>
            <option value='Select a layout'>Select a layout</option>
          </select>
        </div>
      </div>
    )
  }
  return item
}

export default LayoutItem