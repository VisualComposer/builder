import React, { useState } from 'react'
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
  let layoutsData:any = LayoutsData[sectionType] // TODO: fix error
  let sectionLabel
  let tooltipText

  const toggleSection = () => {
    setIsSectionOpened(!isSectionOpened)
  }

  const handleClick = (index:number) => {
    setActiveItem(index)
  }

  if (sectionType === 'layout') {
    sectionLabel = localizations.layout || 'Layout'
    tooltipText = localizations.layoutsDescription || 'Selecting a layout for the page, post, custom post type or layout is required.'
  } else if (sectionType === 'content') {
    sectionLabel = localizations.content || 'Content'
    tooltipText = localizations.contentSectionDescription || 'Pre-select content or start with a blank content area.'
    const hubTemplates = dataManager.get('hubGetTemplatesTeaser').filter((template:any) => template.isPageIntro)
      layoutsData = layoutsData.concat(hubTemplates)
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

  const toggleSectionText = localizations.toggleSection || 'Toggle section'

  const templateGroupClasses = classNames({
    'template-group': true,
    'template-group--active': isSectionOpened
  })

  return (
    <div className={templateGroupClasses}>
      <div className='template-group-label-container'>
        <div className='template-group-label'>
          {sectionLabel}
          <Tooltip>{tooltipText}</Tooltip>
        </div>
        <button
          className='template-group-toggle blank-button vcv-ui-icon vcv-ui-icon-chevron-thick'
          type='button'
          aria-label={toggleSectionText}
          title={toggleSectionText}
          onClick={toggleSection}
        />
      </div>
      <div className='template-items-section'>
        {getItems()}
      </div>
    </div>
  )
}

export default LayoutsSection