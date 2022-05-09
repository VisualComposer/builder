import React, { useState } from 'react'
import classNames from 'classnames'
import { getService } from 'vc-cake'
// @ts-ignore
import Tooltip from 'public/components/tooltip/tooltip'
import LayoutItem from './layoutItem'

const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')

interface Props {
  sectionType: string
}

const LayoutsSection: React.FC<Props> = ({sectionType}) => {
  const [isSectionOpened, setIsSectionOpened] = useState(true)
  let layoutsData:any = []
  let sectionLabel
  let tooltipText

  const toggleSection = () => {
    setIsSectionOpened(!isSectionOpened)
  }

  if (sectionType === 'layout') {
    sectionLabel = localizations.layout || 'Layout'
    tooltipText = 'Layout fafdsfa'
    layoutsData = [
      {
        type: 'default',
        label: 'Default layout'
      },
      {
        type: 'blank',
        label: 'Blank layout'
      },
      {
        type: 'custom',
        label: 'Custom layout'
      },
    ]
  } else {
    sectionLabel = localizations.content || 'Content'
    tooltipText = 'Content fsdasfr'
    // TODO: Get template data from backend
    layoutsData = []
  }

  const getItems = () => {
    return layoutsData.map((item:any, i:number) => {
      const isSelectable = sectionType === 'content'
        return <LayoutItem key={`item-${i}`} itemData={item} isSelectable={isSelectable} />
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