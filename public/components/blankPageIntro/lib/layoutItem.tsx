import React, { useState } from 'react'
import classNames from 'classnames'
import { getStorage, getService, env } from 'vc-cake'
// @ts-ignore
import Tooltip from 'public/components/tooltip/tooltip'
// @ts-ignore
import CustomLayoutDropdown from 'public/sources/attributes/pageSettingsLayouts/lib/customLayoutDropdown'
// @ts-ignore
import Dropdown from 'public/sources/attributes/dropdown/Component'
// @ts-ignore
import store from 'public/editor/stores/store'
// @ts-ignore
import { notificationAdded } from 'public/editor/stores/notifications/slice'

const cook = getService('cook')
const dataManager = getService('dataManager')
const documentManager = getService('document')
const myTemplatesService = getService('myTemplates')
const assetsStorage = getStorage('assets')
const elementsStorage = getStorage('elements')
const settingsStorage = getStorage('settings')
const workspaceStorage = getStorage('workspace')
const localizations = dataManager.get('localizations')
const workspaceSettings = workspaceStorage.state('settings')
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
    vcvLastLoadedFooterTemplate:string,
    vcvGlobalTemplatesList: any
  }
}
interface Props {
  itemData: any,
  handleClick: any,
  isActive: boolean,
  index: number
}

const allAvailableVcLayouts:any = window.VCV_PAGE_TEMPLATES_LAYOUTS_ALL && window.VCV_PAGE_TEMPLATES_LAYOUTS_ALL()
const userTemplates:any = window.vcvGlobalTemplatesList

const LayoutItem: React.FC<Props> = ({ itemData, handleClick, isActive, index }) => {
  const [dropdownValue, setDropdownValue] = useState({value: ''})

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

  const handleLayoutChange = (selectedTemplate:any, isLocked:boolean) => {
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

  const getElementExceededLimitStatus = (element:any) => {
    interface LimitData {
      hasExceeded: boolean,
      limit: any
    }
    const limitData:LimitData = {} // TODO: fix error
    if (Object.prototype.hasOwnProperty.call(element, 'metaElementLimit')) {
      const limit = parseInt(element.metaElementLimit)
      const limitedElements = documentManager.getByTag(element.tag) || {}
      if (limit > 0 && Object.keys(limitedElements).length >= limit) {
        limitData.hasExceeded = true
        limitData.limit = limit
      }
    }
    return limitData
  }

  const handleTemplateChange = (templateType:string, id:string) => {
    elementsStorage.state('elementAddList').set([])
    const next = (elements:any) => {
      const existingJobs = assetsStorage.state('jobs').get()
      const existingElementVisibleJobs = existingJobs && existingJobs.elements && existingJobs.elements.filter((job: any) => !job.hidden)
      const existingJobsCount = (existingElementVisibleJobs && existingElementVisibleJobs.length) || 0

      elementsStorage.trigger('merge', elements)

      const handleJobsChange = (data: any) => {
        const addedElements = elementsStorage.state('elementAddList').get()
        const addedElementsCount = addedElements.length
        const visibleJobs = data.elements.filter((element: any) => !element.hidden)
        if (existingJobsCount + addedElementsCount === visibleJobs.length) {
          const jobsInProgress = data.elements.find((element: any) => element.jobs)

          if (jobsInProgress) {
            return
          }

          elementsStorage.state('elementAddList').set([])
          workspaceSettings.set(false)
          assetsStorage.state('jobs').ignoreChange(handleJobsChange)
        }
        assetsStorage.state('jobs').onChange(handleJobsChange)
      }
    }

    if (env('VCV_FT_TEMPLATE_DATA_ASYNC')) {
      myTemplatesService.load(id, (response:any) => {
        let elementLimitHasExceeded = false
        if (response.data) {
          Object.keys(response.data).forEach((elementId) => {
            const element = response.data[elementId]
            const limitData = getElementExceededLimitStatus(element)
            if (limitData.hasExceeded) {
              const cookElement = cook.get(element)
              const elementName = cookElement.get('name')
              let errorText = localizations.templateContainsLimitElement || 'The template you want to add contains %element element. You already have %element element added - remove it before adding the template.'
              errorText = errorText.split('%element').join(elementName)
              store.dispatch(notificationAdded({
                type: 'error',
                text: errorText,
                time: 5000,
                showCloseButton: true
              }))
            elementLimitHasExceeded = true
            }
          })
        }

        if (elementLimitHasExceeded) {
          return
        }

        const customPostData = response && response.allData && response.allData.postFields && response.allData.postFields.dynamicFieldCustomPostData
        if (customPostData) {
          const postData = settingsStorage.state('postData').get()
          const postFields = settingsStorage.state('postFields').get()

          Object.keys(customPostData).forEach((key) => {
            const item = customPostData[key]
            postData[key] = item.postData
            postFields[key] = item.postFields
          })

          settingsStorage.state('postData').set(postData)
          settingsStorage.state('postFields').set(postFields)
        }
        next(response.data)
      })
    }
  }

  const isSelect = itemData.type === 'vc-theme' || itemData.type === 'myTemplate'
  const icon:any = itemData?.icon?.default() || null
  const isPremiumActivated = dataManager.get('isPremiumActivated')
  const isPremiumContent = !isPremiumActivated && (itemData?.contentType === 'premium')
  const premiumBagde = isPremiumContent ? <span className='item-badge'>{localizations.premium || 'Premium'}</span> : null

  let tooltip:any = <Tooltip />
  let dropdown:any = null
  let checkedIcon:any = <i className='vcv-ui-icon vcv-ui-icon-checked-circle' />

  if (isSelect) {
    tooltip = null
    checkedIcon = null
    if (itemData.type === 'vc-theme') {
      let hfsLayouts:any = allAvailableVcLayouts.find((layout:any) => layout.type === 'vc-theme').values
      hfsLayouts = hfsLayouts.map((layout:any) => {
        layout.prefix = 'vc-theme__'
        return layout
      })
      dropdown = (
        <CustomLayoutDropdown
          onTemplateChange={handleLayoutChange}
          current={dropdownValue}
          options={hfsLayouts}
        />
      )
    }
    if (itemData.type === 'myTemplate') {
      const options = {values: userTemplates}
      dropdown = (<Dropdown
        fieldKey='userTemplates'
        options={options}
        value={{value: ''}}
        updater={handleTemplateChange}
      />)
    }
  }

  const itemClasses = classNames({
    'template-item': true,
    'template-item--selected': isActive,
    'template-item--disabled': isPremiumContent
  })
  const infoClasses = classNames({
    'template-info': true,
    'template-info--select': isSelect
  })

  return (
    <div className={itemClasses} onClick={handleItemClick}>
      {premiumBagde}
      <div className='template-thumbnail'>
        {icon}
      </div>
      <div className={infoClasses}>
        <span className='template-label'>{itemData.label}</span>
          {dropdown}
          {tooltip}
          {checkedIcon}
      </div>
    </div>
  )
}

export default LayoutItem