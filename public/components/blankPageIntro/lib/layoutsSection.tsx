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
  sectionType: string
}

const LayoutsSection: React.FC<Props> = ({sectionType}) => {
  const [isSectionOpened, setIsSectionOpened] = useState(true)
  const [activeItem, setActiveItem] = useState(0)
  let layoutsData:any = LayoutsData[sectionType] || [] // TODO: fix error
  let sectionLabel
  let tooltipText

  const toggleSection = () => {
    setIsSectionOpened(!isSectionOpened)
  }

  const handleClick = (index:number) => {
    setActiveItem(index)
  }

  const toggleSectionText = localizations.toggleSection || 'Toggle section'
  let tooltip:any = null
  let sectionToggle:any = (
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
    const hubTemplates = dataManager.get('hubGetTemplatesTeaser').filter((template:any) => template.isPageIntro)
    layoutsData = layoutsData.concat(hubTemplates)
  } else if (sectionType === 'popup' || sectionType === 'vcv_layouts') {
    sectionLabel = ''
    sectionToggle = null
  }

  const getItems = () => {
    return layoutsData.map((item:any, i:number) => {
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