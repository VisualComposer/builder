import React, { useRef, useState, useEffect, useCallback } from 'react'
import classNames from 'classnames'
import { getStorage, getService } from 'vc-cake'
import Sidebar from './lib/sidebar'
import LayoutsSection from './lib/layoutsSection'
// @ts-ignore
import PageSettingsTitle from 'public/sources/attributes/pageSettingsTitle/Component'
// @ts-ignore
import Scrollbar from 'public/components/scrollbar/scrollbar'

const assetsStorage = getStorage('assets')
const elementsStorage = getStorage('elements')
const workspaceStorage = getStorage('workspace')
const settingsStorage = getStorage('settings')
const cook = getService('cook')
const dataManager = getService('dataManager')
const documentsService = getService('document')
const localizations = dataManager.get('localizations')
const workspaceIFrame = workspaceStorage.state('iframe')
const editorType = dataManager.get('editorType')

interface Props {
  unmountBlankPage: () => void
}

let addedId = ''
let iframeWindow:any = {}

const BlankPageIntro: React.FC<Props> = ({ unmountBlankPage }) => {
  const [isSidebarOpened, setIsSidebarOpened] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const scrollbarsRef = useRef(null)

  useEffect(() => {
    workspaceIFrame.onChange(handleIframeReload)
    elementsStorage.state('elementAddList').onChange(handleAddElement)
    assetsStorage.state('jobs').onChange(handleJobsChange)
    workspaceStorage.state('downloadingItems').onChange(handleDownloadTemplate)
    return () => {
      workspaceIFrame.ignoreChange(handleIframeReload)
      elementsStorage.state('elementAddList').ignoreChange(handleAddElement)
      assetsStorage.state('jobs').ignoreChange(handleJobsChange)
      workspaceStorage.state('downloadingItems').ignoreChange(handleDownloadTemplate)
    }
  }, [isLoading])

  const handleAddElement = useCallback((data:any) => {
    if (!data.length && !isLoading) {
      setIsLoading(true)
    }
  }, [isLoading])

  const handleJobsChange = useCallback((data:any) => {
    if (data.elements && !data.elements.find((element:any) => element.jobs) && isLoading) {
      setIsLoading(false)
    }
  }, [isLoading])

  const handleIframeReload = useCallback((data:any) => {
    if ((data.type && (data.type !== 'loaded') && (data.type !== 'layoutLoaded')) && !isLoading) {
      setIsLoading(true)
    } else if ((!data || (data?.type === 'loaded' || data.type === 'layoutLoaded')) && isLoading) {
      setIsLoading(false)
    }
  }, [isLoading])

  const handleDownloadTemplate = useCallback((data:any) => {
    if (data.length) {
      setIsLoading(true)
    } else if (!data.length) {
      setIsLoading(false)
    }
  }, [isLoading])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) {
      return false
    }
    if (editorType === 'popup') {
      const elements = documentsService.all()
      if (!Object.keys(elements).length) {
        const cookElement = cook.get({ tag: 'popupRoot' }).toJS()
        const rowElement = cook.get({ tag: 'row', parent: cookElement.id }).toJS()
        elementsStorage.trigger('add', cookElement)
        elementsStorage.trigger('add', rowElement)
        addedId = cookElement.id
        const iframe = (document.getElementById('vcv-editor-iframe') as HTMLIFrameElement)
        iframeWindow = iframe?.contentWindow?.window
        iframeWindow?.vcv?.on('ready', openEditForm)
      }
    } else if (editorType === 'vcv_layouts') {
      const elements = documentsService.all()
      if (!Object.keys(elements).length) {
        const layoutType = settingsStorage.state('layoutType').get()
        const elementTag = layoutType === 'postTemplate' ? 'layoutContentArea' : 'layoutPostList'

        const blankHeaderTitle = localizations.blankHeaderTitle || 'Design your header here as a part of your layout. You can also download header templates from the Visual Composer Hub.'
        const blankFooterTitle = localizations.blankFooterTitle || 'Design your footer here as a part of your layout. You can also download footer templates from the Visual Composer Hub.'
        const commonDesignOptions = { device: { all: { boxModel: { marginTop: '50px', marginBottom: '50px' } } } }
        const headerElement = cook.get({
          tag: 'textBlock',
          designOptions: commonDesignOptions,
          output: `<p style="text-align:center;">${blankHeaderTitle}</p>`
        }).toJS()
        const initialElement = cook.get({ tag: elementTag }).toJS()
        const footerElement = cook.get({
          tag: 'textBlock',
          designOptions: commonDesignOptions,
          output: `<p style="text-align:center;">${blankFooterTitle}</p>`
        }).toJS()
        elementsStorage.trigger('add', headerElement)
        elementsStorage.trigger('add', initialElement)
        elementsStorage.trigger('add', footerElement)
      }
    } else {
      const settings = {
        action: 'add',
        element: {},
        tag: '',
        options: {}
      }
      workspaceStorage.state('settings').set(settings)
    }
    unmountBlankPage()
  }, [addedId])

  const openEditForm = useCallback((action:string, id:string) => {
    if (action === 'add' && id === addedId) {
      workspaceStorage.trigger('edit', addedId, '')
      iframeWindow?.vcv?.off('ready', openEditForm)
    }
  }, [iframeWindow])

  const toggleSettings = useCallback(() => {
    setIsSidebarOpened(!isSidebarOpened)
  }, [isSidebarOpened])

  const blankPageClasses = classNames({
    'blank-page-container': true,
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

  let settingsButton:any = (
    <button
      className='blank-button settings-btn vcv-ui-icon vcv-ui-icon-cog'
      aria-label={postOptionsText}
      title={postOptionsText}
      type='button'
      onClick={toggleSettings}
    />
  )

  let content:any = (
    <div className='template-groups-container'>
      <Scrollbar ref={scrollbarsRef}>
        <LayoutsSection sectionType='layout' />
        <LayoutsSection sectionType='content' />
      </Scrollbar>
    </div>
  )

  if (editorType === 'popup') {
    content = (
      <div className='template-groups-container'>
        <Scrollbar ref={scrollbarsRef}>
          <LayoutsSection sectionType='popup' />
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
          <LayoutsSection sectionType='vcv_layouts' />
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
            updater={() => {}} // required for attributes
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
