import React, { useRef, useState, useEffect, useCallback } from 'react'
import classNames from 'classnames'
import MobileDetect from 'mobile-detect'
import { getStorage, getService, env } from 'vc-cake'
import Sidebar from './lib/sidebar'
import LayoutsSection from './lib/layoutsSection'
// @ts-ignore
import PageSettingsTitle from 'public/sources/attributes/pageSettingsTitle/Component'
// @ts-ignore
import Scrollbar from 'public/components/scrollbar/scrollbar'
// @ts-ignore
import store from 'public/editor/stores/store'
// @ts-ignore
import { notificationAdded } from 'public/editor/stores/notifications/slice'

const assetsStorage = getStorage('assets')
const elementsStorage = getStorage('elements')
const workspaceStorage = getStorage('workspace')
const settingsStorage = getStorage('settings')
const hubTemplatesStorage = getStorage('hubTemplates')
const cook = getService('cook')
const dataManager = getService('dataManager')
const documentService = getService('document')
const myTemplatesService = getService('myTemplates')
const localizations = dataManager.get('localizations')
const workspaceIFrame = workspaceStorage.state('iframe')
const editorType = dataManager.get('editorType')
const workspaceSettings = workspaceStorage.state('settings')

interface Props {
  unmountBlankPage: () => void
}

interface IframeWindow {
  vcv?: {
    on: (event:string, callback: (action:string, id:string) => void) => void,
    off: (event:string, callback: (action:string, id:string) => void) => void
  }
}

interface ActiveTemplate {
  id:string,
  bundle:string,
  templateType:string,
  type:string,
  isPageIntro:boolean,
  // setting type any because item can be a hub template item from storage
  setActiveTemplate: (template:any) => void, // eslint-disable-line
}

let addedId = ''
let iframeWindow:IframeWindow | any = {} // eslint-disable-line

const mobileDetect = new MobileDetect(window.navigator.userAgent)
const isMobile = mobileDetect.mobile() && (mobileDetect.tablet() || mobileDetect.phone())

const BlankPageIntro: React.FC<Props> = ({ unmountBlankPage }) => {
  const [isSidebarOpened, setIsSidebarOpened] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [activeLayout, setActiveLayout] = useState({ value: '' })
  const [activeTemplate, setActiveTemplate] = useState<ActiveTemplate|undefined>(undefined)
  const [hubTemplates, setHubTemplates] = useState(hubTemplatesStorage.state('templates').get())
  const scrollbarsRef = useRef(null)

  useEffect(() => {
    workspaceIFrame.onChange(handleIframeReload)
    elementsStorage.state('elementAddList').onChange(handleAddElement)
    assetsStorage.state('jobs').onChange(handleJobsChange)
    workspaceStorage.state('downloadingItems').onChange(handleDownloadTemplate)
    hubTemplatesStorage.state('templates').onChange(templateStorageChange)
    return () => {
      workspaceIFrame.ignoreChange(handleIframeReload)
      elementsStorage.state('elementAddList').ignoreChange(handleAddElement)
      assetsStorage.state('jobs').ignoreChange(handleJobsChange)
      workspaceStorage.state('downloadingItems').ignoreChange(handleDownloadTemplate)
      hubTemplatesStorage.state('templates').ignoreChange(templateStorageChange)
    }
  })

  // setting type any because item can be a hub template item from storage
  const templateStorageChange = useCallback((data:any) => { // eslint-disable-line
    if (!hubTemplates.length) {
      setHubTemplates(data)
    }
  }, [hubTemplates.length])

  const updateLayout = useCallback((data: { value: string }) => {
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

  const applyTemplate = useCallback((templateType:string, id:string) => {
    setIsLoading(true)
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
  }, [])

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
      const limitedElements = documentService.getByTag(element.tag) || {}
      if (limit > 0 && Object.keys(limitedElements).length >= limit) {
        limitData.hasExceeded = true
        limitData.limit = limit
      }
    }
    return limitData
  }

  const handleAddElement = useCallback((data: { length: number }) => {
    if (!data.length && !isLoading) {
      setIsLoading(true)
    }
  }, [isLoading])

  const handleJobsChange = useCallback((data: { elements: [] }) => {
    if (data.elements && !data.elements.find((element: {jobs: [] }) => element.jobs) && isLoading) {
      if (activeLayout.value) {
        updateLayout(activeLayout)
      } else {
        setIsLoading(false)
        unmountBlankPage()
        settingsStorage.state('skipBlank').set(true)
      }
    }
  }, [isLoading, activeLayout, unmountBlankPage, updateLayout])

  const handleIframeReload = useCallback((data: { type: string }) => {
    if ((data.type && (data.type !== 'loaded') && (data.type !== 'layoutLoaded')) && !isLoading) {
      setIsLoading(true)
    } else if ((!data || (data?.type === 'loaded' || data.type === 'layoutLoaded')) && isLoading && !isDownloading) {
      setIsLoading(false)
      unmountBlankPage()
      settingsStorage.state('skipBlank').set(true)
    }
  }, [isLoading, isDownloading, unmountBlankPage])

  const handleDownloadTemplate = useCallback((data: { length: number }) => {
    if (data.length) {
      setIsLoading(true)
      setIsDownloading(true)
    } else if (!data.length) {
      setIsLoading(false)
      setIsDownloading(false)

      if (activeTemplate?.templateType) {
        const allTemplates = hubTemplatesStorage.state('templates').get()
        const template = allTemplates[activeTemplate.templateType]?.templates.find((item: { bundle:string }) => item.bundle === activeTemplate.bundle)
        if (template) {
          applyTemplate(activeTemplate.templateType, template.id)
        }
      }
    }
  }, [activeTemplate, applyTemplate])

  // setting type any because item can be a hub template item from storage
  const handleItemClick = (itemData:any) => { // eslint-disable-line
    if (itemData.sectionType === 'layout') {
      setActiveLayout(itemData)
    } else {
      setActiveTemplate(itemData)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editorType === 'popup') {
      if (activeTemplate && activeTemplate.id) {
        applyTemplate(activeTemplate.type, activeTemplate.id)
        return
      }
      const elements = documentService.all()
      if (!Object.keys(elements).length) {
        const cookElement = cook.get({ tag: 'popupRoot' }).toJS()
        const rowElement = cook.get({ tag: 'row', parent: cookElement.id }).toJS()
        elementsStorage.trigger('add', cookElement)
        elementsStorage.trigger('add', rowElement)
        addedId = cookElement.id
        const iframe = document.getElementById('vcv-editor-iframe') as HTMLIFrameElement
        iframeWindow = iframe?.contentWindow?.window
        if ('vcv' in iframeWindow) {
          iframeWindow?.vcv?.on('ready', openEditForm)
        }
      }
    } else if (editorType === 'vcv_layouts') {
      if (activeTemplate?.id) {
        applyTemplate(activeTemplate.type, activeTemplate.id)
        return
      }
      const elements = documentService.all()
      if (!Object.keys(elements).length) {
        const elementTag = activeTemplate?.type === 'postTemplate' ? 'layoutContentArea' : 'layoutPostList'
        const commonDesignOptions = { device: { all: { boxModel: { marginTop: '50px', marginBottom: '50px' } } } }
        const headerElement = cook.get({
          tag: 'textBlock',
          designOptions: commonDesignOptions,
          output: `<p style="text-align:center;">${localizations.blankHeaderTitle}</p>`
        }).toJS()
        const initialElement = cook.get({ tag: elementTag }).toJS()
        const footerElement = cook.get({
          tag: 'textBlock',
          designOptions: commonDesignOptions,
          output: `<p style="text-align:center;">${localizations.blankFooterTitle}</p>`
        }).toJS()
        elementsStorage.trigger('add', headerElement)
        elementsStorage.trigger('add', initialElement)
        elementsStorage.trigger('add', footerElement)
      }
    } else {
      if (activeTemplate?.id || activeLayout.value) {
        if (activeTemplate?.id) {
          let templates = hubTemplates
          if (Object.keys(hubTemplates).length === 0) {
            templates = hubTemplatesStorage.state('templates').get()
          }
          const templateType = activeTemplate?.type === 'myTemplate' ? 'custom' : activeTemplate.templateType
          const templateCategory = templates[templateType]?.templates
          const template = activeTemplate?.type === 'myTemplate'
            ? templateCategory.find((item: { id:string }) => item.id === activeTemplate.id)
            : templateCategory.find((item: { bundle:string }) => item.bundle === activeTemplate.bundle)

          if (activeTemplate.isPageIntro) {
            if (!template) {
              setIsDownloading(true)
              hubTemplatesStorage.trigger('downloadTemplate', activeTemplate)
              return
            }
          }
          if (template) {
            applyTemplate(templateType, template.id)
            if (activeLayout.value) {
              return
            }
          }
        }
        if (activeLayout.value) {
          updateLayout(activeLayout)
        }
        return
      }
      const settings = {
        action: 'add',
        element: {},
        tag: '',
        options: {}
      }
      workspaceStorage.state('settings').set(settings)
    }
    unmountBlankPage()
    settingsStorage.state('skipBlank').set(true)
  }

  const openEditForm = useCallback((action:string, id:string) => {
    if (action === 'add' && id === addedId) {
      workspaceStorage.trigger('edit', addedId, '')
      if ('vcv' in iframeWindow) {
        iframeWindow?.vcv?.off('ready', openEditForm)
      }
    }
  }, [])

  const toggleSettings = useCallback(() => {
    setIsSidebarOpened(!isSidebarOpened)
  }, [isSidebarOpened])

  const blankPageClasses = classNames({
    'blank-page-container': true,
    'blank-page--mobile': isMobile,
    'blank-page-settings--active': isSidebarOpened
  })

  const buttonClasses = classNames({
    'blank-button': true,
    'blank-page-submit-button': true,
    'blank-page-submit-button--loading': isLoading
  })

  const url = new URL(window.location.href)
  const postOptionsText = url.searchParams.get('post_type') === 'page' ? localizations.pageSettings || 'Page Options' : localizations.postOptions || 'Post Options'
  const getStartedText = localizations.getStartedText || 'GET STARTED'

  let settingsButton:React.ReactElement | null = (
    <button
      className='blank-button settings-btn vcv-ui-icon vcv-ui-icon-cog'
      aria-label={postOptionsText}
      title={postOptionsText}
      type='button'
      onClick={toggleSettings}
    />
  )

  let content:React.ReactElement | null = (
    <div className='template-groups-container'>
      <Scrollbar ref={scrollbarsRef}>
        <LayoutsSection sectionType='layout' handleItemClick={handleItemClick} />
        <LayoutsSection sectionType='content' handleItemClick={handleItemClick} />
      </Scrollbar>
    </div>
  )

  if (editorType === 'popup') {
    content = (
      <div className='template-groups-container'>
        <Scrollbar ref={scrollbarsRef}>
          <LayoutsSection sectionType='popup' handleItemClick={handleItemClick} />
        </Scrollbar>
      </div>
    )
    settingsButton = null
  }

  if (['template', 'header', 'footer', 'sidebar'].includes(editorType)) {
    content = null
    settingsButton = null
  }

  if (editorType === 'vcv_layouts') {
    content = (
      <div className='template-groups-container'>
        <Scrollbar ref={scrollbarsRef}>
          <LayoutsSection sectionType='vcv_layouts' handleItemClick={handleItemClick} />
        </Scrollbar>
      </div>
    )
    settingsButton = null
  }

  const formClasses = classNames({
    'blank-page-form': true,
    'blank-page-form--nocontent': ['template', 'header', 'footer', 'sidebar'].includes(editorType)
  })

  return (
    <div className={blankPageClasses}>
      <Sidebar toggleSettings={toggleSettings} />
      <form onSubmit={handleSubmit} className={formClasses}>
        <div className='blank-page-input-container'>
          <PageSettingsTitle
            key='pageSettingsTitle'
            fieldKey='pageSettingsTitle'
            updater={() => { return false }} // required for attributes
            value='' // required for attributes
          />
          {settingsButton}
        </div>
        {content}
        <button className={buttonClasses} type='submit'>{getStartedText}</button>
      </form>
    </div>
  )
}

export default BlankPageIntro
