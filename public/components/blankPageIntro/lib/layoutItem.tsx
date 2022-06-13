import React, { useState, useEffect, memo, useCallback } from 'react'
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
const hubTemplatesStorage = getStorage('hubTemplates')
const localizations = dataManager.get('localizations')
const workspaceSettings = workspaceStorage.state('settings')
const workspaceIFrame = workspaceStorage.state('iframe')
const editorType = dataManager.get('editorType')

declare global {
  interface Window {
    vcvLastLoadedPageTemplate:string,
    vcvLastLoadedHeaderTemplate:string,
    vcvLastLoadedSidebarTemplate:string,
    vcvLastLoadedFooterTemplate:string
  }
}

interface Props {
  // setting type any because item can be a hub template item from storage
  itemData:any, // eslint-disable-line
  handleClick: (index: number) => void,
  isActive: boolean,
  index: number
}

const LayoutItem: React.FC<Props> = ({ itemData, handleClick, isActive, index }) => {
  const [dropdownValue, setDropdownValue] = useState({ value: '' })
  const [templateDropdownValue, setTemplateDropdownValue] = useState('')
  const [hubTemplates, setHubTemplates] = useState(hubTemplatesStorage.state('templates').get())
  const [isLoading, setIsLoading] = useState(false)
  const [isDropdownFocused, setIsDropdownFocused] = useState(isActive)

  const handleTemplateChange = useCallback((templateType:string, id:string) => {
    removeAllElements()
    if (templateType !== 'hub') {
      handleClick(index)
    }
    elementsStorage.state('elementAddList').set([])
    settingsStorage.state('skipBlank').set(true)
    const next = (elements:[]) => {
      const existingJobs = assetsStorage.state('jobs').get()
      const existingElementVisibleJobs = existingJobs && existingJobs.elements && existingJobs.elements.filter((job: { hidden: boolean }) => !job.hidden)
      const existingJobsCount = (existingElementVisibleJobs && existingElementVisibleJobs.length) || 0

      elementsStorage.trigger('merge', elements)

      const handleJobsChange = (data: { elements: [] }) => { // eslint-disable-line
        const addedElements = elementsStorage.state('elementAddList').get()
        const addedElementsCount = addedElements.length
        const visibleJobs = data.elements.filter((element: { hidden: boolean }) => !element.hidden)
        if (existingJobsCount + addedElementsCount === visibleJobs.length) {
          const jobsInProgress = data.elements.find((element: { jobs: [] }) => element.jobs)

          if (jobsInProgress) {
            return
          }

          elementsStorage.state('elementAddList').set([])
          workspaceSettings.set(false)
          assetsStorage.state('jobs').ignoreChange(handleJobsChange)
        }
        assetsStorage.state('jobs').onChange(handleJobsChange) // eslint-disable-line
      }
    }

    if (env('VCV_FT_TEMPLATE_DATA_ASYNC')) {
      myTemplatesService.load(id, (response:any) => { // eslint-disable-line
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
    setTemplateDropdownValue(id)
  }, [handleClick, index, dropdownValue])

  const updateLayout = useCallback((data: { value: string }) => {
    setDropdownValue(data)
    if (!env('VCV_JS_THEME_EDITOR')) {
      settingsStorage.state('pageTemplate').set(data)

      const lastLoadedPageTemplate = window.vcvLastLoadedPageTemplate || (dataManager.get('pageTemplatesLayoutsCurrent'))
      const lastSavedPageTemplate = settingsStorage.state('pageTemplate').get()

      const lastLoadedHeaderTemplate = window.vcvLastLoadedHeaderTemplate || (dataManager.get('headerTemplates').current)
      const lastSavedHeaderTemplate = settingsStorage.state('headerTemplate').get()

      const lastLoadedSidebarTemplate = window.vcvLastLoadedSidebarTemplate || (dataManager.get('sidebarTemplates').current)
      const lastSavedSidebarTemplate = settingsStorage.state('sidebarTemplate').get()

      const lastLoadedFooterTemplate = window.vcvLastLoadedFooterTemplate || (dataManager.get('footerTemplates').current)
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
  }, [])

  // setting type any because item can be a hub template item from storage
  const templateStorageChange = useCallback((data:any) => { // eslint-disable-line
    if (!hubTemplates.length) {
      const templates = hubTemplatesStorage.state('templates').get()
      setHubTemplates(templates)
    }
    const template = data[itemData.templateType]?.templates?.find((item: { bundle: string }) => item.bundle === itemData.bundle)
    if (template && isActive) {
      handleTemplateChange(itemData.templateType, template.id)
    }
  }, [hubTemplates.length, handleTemplateChange, itemData.bundle, itemData.templateType])

  const downloadTemplate = useCallback((data: { length: number }) => {
    if (data.length && !isLoading) {
      setIsLoading(true)
    }
  }, [isLoading])

  const handleItemClick = useCallback(() => {
    if (itemData.control === 'button') {
      handleClick(index)
      const data = {
        type: itemData.type,
        value: itemData.value,
        stretchedContent: false
      }
      if (editorType === 'vcv_layouts') {
        settingsStorage.state('layoutType').set(data.type)
      } else {
        updateLayout(data)
      }
    }
    if (itemData.control === 'dropdown') {
      setIsDropdownFocused(true)
    }
    if (itemData.isPageIntro) {
      handleClick(index)
      let templates = hubTemplates
      if (Object.keys(hubTemplates).length === 0) {
        templates = hubTemplatesStorage.state('templates').get()
        setHubTemplates(templates)
      }
      const template = templates[itemData.templateType].templates.find((item: { bundle:string }) => item.bundle === itemData.bundle)
      if (template) {
        handleTemplateChange(itemData.templateType, template.id)
      } else {
        hubTemplatesStorage.trigger('downloadTemplate', itemData)
      }
    }
  }, [handleClick, handleTemplateChange, hubTemplates, index, itemData, updateLayout])

  useEffect(() => {
    setIsDropdownFocused(isActive)
    workspaceStorage.state('downloadingItems').onChange(downloadTemplate)
    hubTemplatesStorage.state('templates').onChange(templateStorageChange)
    return () => {
      workspaceStorage.state('downloadingItems').ignoreChange(downloadTemplate)
      hubTemplatesStorage.state('templates').ignoreChange(templateStorageChange)
    }
  }, [isActive, downloadTemplate, templateStorageChange])

  const removeAllElements = () => {
    const allElements = documentManager.children(false)
    allElements.forEach((row: { id: string }, i:number) => {
      const silent = allElements.length - 1 !== i
      elementsStorage.trigger('remove', row.id, { silent })
    })
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

  const handleLayoutChange = useCallback((selectedTemplate:string) => {
    handleClick(index)
    const layoutData = selectedTemplate.split('__')
    const value = layoutData[1]
    const data = {
      type: layoutData[0],
      value: value,
      stretchedContent: false
    }
    updateLayout(data)
  }, [updateLayout, handleClick, index])

  const getElementExceededLimitStatus = (element:{ metaElementLimit:string, tag:string }) => {
    interface LimitData {
      hasExceeded: boolean,
      limit: number
    }
    const limitData:LimitData = {
      hasExceeded: false,
      limit: 0
    }
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

  const isSelect = itemData.control === 'dropdown'
  const icon:React.ReactElement | null = itemData?.icon?.default() || null
  const isPremiumActivated = dataManager.get('isPremiumActivated')
  const isPremiumContent = !isPremiumActivated && (itemData?.contentType === 'premium')
  const premiumBagde = isPremiumContent ? <span className='item-badge'>{localizations.premium || 'Premium'}</span> : null

  let tooltip:React.ReactElement | null = itemData.description && <Tooltip>{itemData.description}</Tooltip>
  let dropdown:React.ReactElement | null = null
  let checkedIcon:React.ReactElement | null = <i className='vcv-ui-icon vcv-ui-icon-checked-circle' />

  if (isSelect) {
    tooltip = null
    checkedIcon = null
    if (itemData.type === 'vc-theme') {
      const allAvailableVcLayouts = dataManager.get('pageTemplatesLayoutsAll')
      let hfsLayouts:React.ReactElement[] = allAvailableVcLayouts.find((layout: { type: string }) => layout.type === 'vc-theme').values
      hfsLayouts = hfsLayouts.map((layout:any) => { // eslint-disable-line
        layout.prefix = 'vc-theme__'
        return layout
      })
      dropdown = (
        <CustomLayoutDropdown
          isFocused={isDropdownFocused}
          onTemplateChange={handleLayoutChange}
          current={dropdownValue}
          options={hfsLayouts}
        />
      )
    } else {
      let options = {
        // values: {}
      }
      let fieldKey = ''
      if (itemData.type === 'myTemplate') {
        const userTemplates = dataManager.get('globalTemplatesList')
        if (!userTemplates.length) {
          return null
        }
        options = { values: userTemplates }
        fieldKey = 'myTemplate'
      }
      if (itemData.type === 'layoutTemplate') {
        const userTemplates = dataManager.get('globalTemplatesList').filter((template: {label: string, group: { label: string }}) => {
          const label = template?.label || template?.group?.label
          return label.toLowerCase() === 'my templates' || label.toLowerCase() === 'select a template'
        })
        options = { values: userTemplates }
        fieldKey = 'myTemplate'
      }
      if (itemData.type === 'popupTemplate') {
        const values = [
          {
            label: localizations.selectAPopup || 'Select a popup',
            value: ''
          }
        ]
        const templates = values.concat(hubTemplates?.popup?.templates || [])
        options = { values: templates }
        fieldKey = 'popupTemplate'
      }
      dropdown = (<Dropdown
        isFocused={isDropdownFocused}
        fieldKey={fieldKey}
        options={options}
        value={templateDropdownValue}
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
  const styles = {
    backgroundImage: ''
  }
  if (itemData.isPageIntro) {
    styles.backgroundImage = `url(${itemData.introPageImageUrl})`
  }

  return (
    <div className={itemClasses} onClick={handleItemClick}>
      {premiumBagde}
      <div className='template-thumbnail' style={styles}>
        {icon}
      </div>
      <div className={infoClasses}>
        <span className='template-label'>{itemData.label || itemData.name}</span>
        {dropdown}
        {tooltip}
        {checkedIcon}
      </div>
    </div>
  )
}

export default memo(LayoutItem)
