import React, { useState } from 'react'
import classNames from 'classnames'
import { getStorage, env } from 'vc-cake'
// @ts-ignore
import Tooltip from 'public/components/tooltip/tooltip'
// @ts-ignore
import CustomLayoutDropdown from 'public/sources/attributes/pageSettingsLayouts/lib/customLayoutDropdown'

const settingsStorage = getStorage('settings')
const workspaceStorage = getStorage('workspace')
const workspaceIFrame = workspaceStorage.state('iframe')

declare global {
  interface Window {
    VCV_PAGE_TEMPLATES_LAYOUTS_ALL:any,
    VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT:any,
    VCV_HEADER_TEMPLATES:any,
    VCV_SIDEBAR_TEMPLATES:any,
    VCV_FOOTER_TEMPLATES:any,
    vcvLastLoadedPageTemplate:string,
    vcvLastLoadedHeaderTemplate:string,
    vcvLastLoadedSidebarTemplate:string,
    vcvLastLoadedFooterTemplate:string
  }
}
interface Props {
  itemData: any,
  handleClick: any,
  isActive: boolean,
  index: number
}

const allAvailableVcLayouts:any = window.VCV_PAGE_TEMPLATES_LAYOUTS_ALL && window.VCV_PAGE_TEMPLATES_LAYOUTS_ALL()

const LayoutItem: React.FC<Props> = ({ itemData, handleClick, isActive, index }) => {
  const [dropdownValue, setDropdownValue] = useState({value: 'Default'})

  const handleItemClick = () => {
    handleClick(index)
    if (itemData.control === 'button') {
      const data = {
        type: itemData.type,
        value: itemData.value,
        stretchedContent: false
      }
      updateTemplate(data)
    }
  }

  const reloadIframe = (lastSavedPageTemplate:string, lastSavedHeaderTemplate:string, lastSavedSidebarTemplate:string, lastSavedFooterTemplate:string) => {
    window.vcvLastLoadedPageTemplate = lastSavedPageTemplate
    window.vcvLastLoadedHeaderTemplate = lastSavedHeaderTemplate
    window.vcvLastLoadedSidebarTemplate = lastSavedSidebarTemplate
    window.vcvLastLoadedFooterTemplate = lastSavedFooterTemplate

    workspaceIFrame.set({
      type: 'reload',
      template: lastSavedPageTemplate,
      header: lastSavedHeaderTemplate,
      sidebar: lastSavedSidebarTemplate,
      footer: lastSavedFooterTemplate
    })
    settingsStorage.state('skipBlank').set(true)
  }

  const updateTemplate = (data:any) => {
    setDropdownValue(data)
    if (!env('VCV_JS_THEME_EDITOR')) {
      settingsStorage.state('pageTemplate').set(data)

      const lastLoadedPageTemplate = window.vcvLastLoadedPageTemplate || (window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT && window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT())
      const lastSavedPageTemplate = settingsStorage.state('pageTemplate').get()

      const lastLoadedHeaderTemplate = window.vcvLastLoadedHeaderTemplate || (window.VCV_HEADER_TEMPLATES && window.VCV_HEADER_TEMPLATES() && window.VCV_HEADER_TEMPLATES().current)
      const lastSavedHeaderTemplate = settingsStorage.state('headerTemplate').get()

      const lastLoadedSidebarTemplate = window.vcvLastLoadedSidebarTemplate || (window.VCV_SIDEBAR_TEMPLATES && window.VCV_SIDEBAR_TEMPLATES() && window.VCV_SIDEBAR_TEMPLATES().current)
      const lastSavedSidebarTemplate = settingsStorage.state('sidebarTemplate').get()

      const lastLoadedFooterTemplate = window.vcvLastLoadedFooterTemplate || (window.VCV_FOOTER_TEMPLATES && window.VCV_FOOTER_TEMPLATES() && window.VCV_FOOTER_TEMPLATES().current)
      const lastSavedFooterTemplate = settingsStorage.state('footerTemplate').get()

      if (
        (lastLoadedPageTemplate && (lastLoadedPageTemplate.value !== lastSavedPageTemplate.value || lastLoadedPageTemplate.type !== lastSavedPageTemplate.type || (lastLoadedPageTemplate.stretchedContent !== lastSavedPageTemplate.stretchedContent))) ||
        (lastLoadedHeaderTemplate && lastLoadedHeaderTemplate !== lastSavedHeaderTemplate) ||
        (lastLoadedSidebarTemplate && lastLoadedSidebarTemplate !== lastSavedSidebarTemplate) ||
        (lastLoadedFooterTemplate && lastLoadedFooterTemplate !== lastSavedFooterTemplate)
      ) {
        reloadIframe(
          lastSavedPageTemplate,
          lastSavedHeaderTemplate,
          lastSavedSidebarTemplate,
          lastSavedFooterTemplate
        )
      }
    }
  }

  const handleDropdownChange = (selectedTemplate:any, isLocked:boolean) => {
    const layoutData = selectedTemplate.constructor === String ? selectedTemplate.split('__') : selectedTemplate.target && selectedTemplate.target.value && selectedTemplate.target.value.split('__')
    let value = layoutData[1]
    if (value !== 'none' && value !== 'default' && parseInt(value)) {
      value = parseInt(layoutData[1])
    }
    const data = {
      type: layoutData[0],
      value: value,
      stretchedContent: false
    }
    updateTemplate(data)
  }

  let hfsLayouts:any = allAvailableVcLayouts.find((layout:any) => layout.type === 'vc-theme').values
  hfsLayouts = hfsLayouts.map((layout:any) => {
    layout.prefix = 'vc-theme__'
    return layout
  })
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

  if (itemData.type === 'vc-theme') {
    item = (
      <div className={itemClasses} onClick={handleItemClick}>
        <div className='template-thumbnail'>
          {icon}
        </div>
        <div className='template-info template-info--select'>
          <span className='template-label'>{itemData.label}</span>
          <CustomLayoutDropdown
            onTemplateChange={handleDropdownChange}
            current={dropdownValue}
            options={hfsLayouts}
          />
        </div>
      </div>
    )
  }
  return item
}

export default LayoutItem