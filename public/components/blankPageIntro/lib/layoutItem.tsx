import React from 'react'
import classNames from 'classnames'
// import { getService } from 'vc-cake'
// @ts-ignore
import Tooltip from 'public/components/tooltip/tooltip'
// @ts-ignore
import CustomLayoutDropdown from 'public/sources/attributes/pageSettingsLayouts/lib/customLayoutDropdown'

// const dataManager = getService('dataManager')
// const localizations = dataManager.get('localizations')

interface Props {
  itemData: any,
  handleClick: any,
  isActive: boolean,
  index: number
}

const LayoutItem: React.FC<Props> = ({ itemData, handleClick, isActive, index }) => {
  const handleItemClick = () => {
    handleClick(index)
  }
  const icon:any = itemData?.icon?.default() || null

  const itemClasses = classNames({
    'template-item': true,
    'template-item--selected': isActive
  })

  let item = (
    <div className={itemClasses} onClick={handleItemClick}>
      <div className='template-thumbnail'>
        {icon}
      </div>
      <div className='template-info'>
        <span className='template-label'>{itemData.label}</span>
        <Tooltip />
        <i className='vcv-ui-icon vcv-ui-icon-checked-circle' />
      </div>
    </div>
  )

  if (itemData.type === 'custom') {
    item = (
      <div className={itemClasses} onClick={handleItemClick}>
        <div className='template-thumbnail'>
            {icon}
        </div>
        <div className='template-info template-info--select'>
          <span className='template-label'>{itemData.label}</span>
          <CustomLayoutDropdown
              onTemplateChange={() => {}}
              current={{value: ''}}
          />
          {/*<select className='vcv-ui-form-dropdown template-select'>*/}
          {/*  <option value='Select a layout'>Select a layout</option>*/}
          {/*</select>*/}
        </div>
      </div>
    )
  }
  return item
}

export default LayoutItem