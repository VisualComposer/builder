import React, { useState, memo } from 'react'
import classNames from 'classnames'
import { getService } from 'vc-cake'
// @ts-ignore
import Tooltip from 'public/components/tooltip/tooltip'
import LayoutItem from './layoutItem'
import LayoutsData from './layoutsData/index'

const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')

interface Props {
  // setting type any because item can be a hub template item from storage
  handleItemClick: (itemData:any) => void // eslint-disable-line
  sectionType: string,
}

interface Item {
  type:string,
  value?:string,
  icon?:React.ReactElement,
  label:string,
  control:string,
  description?:string,
  contentType?:string
}

const LayoutsSection: React.FC<Props> = ({ sectionType, handleItemClick }) => {
  const [isSectionOpened, setIsSectionOpened] = useState(true)
  const [activeItem, setActiveItem] = useState(0)
  // @ts-ignore
  let sectionData:Item[] = LayoutsData[sectionType]
  let sectionLabel
  let tooltipText

  const toggleSection = () => {
    setIsSectionOpened(!isSectionOpened)
  }

  // setting type any because item can be a hub template item from storage
  const handleClick = (index:number, itemData:any) => { // eslint-disable-line
    setActiveItem(index)
    itemData.sectionType = sectionType
    handleItemClick(itemData)
  }

  const toggleSectionText = localizations.toggleSection || 'Toggle section'
  let tooltip:React.ReactElement | null = null
  let sectionToggle:React.ReactElement | null = (
    <button
      className='template-group-toggle blank-button vcv-ui-icon vcv-ui-icon-chevron-thick'
      type='button'
      aria-label={toggleSectionText}
      title={toggleSectionText}
      onClick={toggleSection}
    />
  )

  if (sectionType === 'layout') {
    sectionLabel = localizations.layout || 'Layout'
    tooltipText = localizations.layoutsDescription || 'Selecting a layout for the page, post, custom post type or layout is required.'
    tooltip = <Tooltip>{tooltipText}</Tooltip>
  } else if (sectionType === 'content') {
    sectionLabel = localizations.content || 'Content'
    tooltipText = localizations.contentSectionDescription || 'Pre-select content or start with a blank content area.'
    tooltip = <Tooltip>{tooltipText}</Tooltip>
    const hubTemplates = dataManager.get('hubGetTemplatesTeaser').filter((template: { isPageIntro: boolean }) => template.isPageIntro)
    sectionData = sectionData.concat(hubTemplates)
  } else if (sectionType === 'popup' || sectionType === 'vcv_layouts') {
    sectionLabel = ''
    sectionToggle = null
  }

  const getItems = () => {
    // setting type any because item can be a hub template item from storage
    return sectionData.map((item:any, i:number) => { // eslint-disable-line
      const isActive = i === activeItem
      return <LayoutItem
        key={`item-${i}`}
        index={i}
        itemData={item}
        handleClick={handleClick}
        isActive={isActive}
      />
    })
  }

  const templateGroupClasses = classNames({
    'template-group': true,
    'template-group--active': isSectionOpened
  })

  return (
    <div className={templateGroupClasses}>
      <div className='template-group-label-container'>
        <div className='template-group-label'>
          {sectionLabel}
          {tooltip}
        </div>
        {sectionToggle}
      </div>
      <div className='template-items-section'>
        {getItems()}
      </div>
    </div>
  )
}

export default memo(LayoutsSection)
