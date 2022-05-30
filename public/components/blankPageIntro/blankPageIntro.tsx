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
const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')
const workspaceIFrame = workspaceStorage.state('iframe')

interface Props {
  unmountBlankPage: any
}

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) {
      return false
    }
    const settings = {
      action: 'add',
      element: {},
      tag: '',
      options: {}
    }
    workspaceStorage.state('settings').set(settings)
    unmountBlankPage()
  }

  const toggleSettings = () => {
    setIsSidebarOpened(!isSidebarOpened)
  }

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

  let content = (
    <>
      <LayoutsSection sectionType='layout' />
      <LayoutsSection sectionType='content' />
    </>
  )

  return (
    <div className={blankPageClasses}>
      <Sidebar toggleSettings={toggleSettings} />
      <form onSubmit={handleSubmit} className='blank-page-form'>
        <div className='blank-page-input-container'>
          <PageSettingsTitle
            key='pageSettingsTitle'
            fieldKey='pageSettingsTitle'
            updater={() => {}} // required for attributes
            value='' // required for attributes
          />
          <button
            className='blank-button settings-btn vcv-ui-icon vcv-ui-icon-cog'
            aria-label={postOptionsText}
            title={postOptionsText}
            type='button'
            onClick={toggleSettings}
          />
        </div>
        <div className='template-groups-container'>
          <Scrollbar ref={scrollbarsRef}>
            {content}
          </Scrollbar>
        </div>
        <button className={buttonClasses} type='submit'>{getStartedText}</button>
      </form>
    </div>
  )
}

export default BlankPageIntro

/**
 * TODO:
 * 1. Handle layout apply when selected in dropdown (x)
 * 2. Dropdown for Content My templates (all user saved templates) (x)
 * 3. Style focus state for fields (x)
 * 4. Handle Blank Page intro render on iframe reload (x)
 * 5. Style mobile view (x)
 * 6. Style attributes (x)
 * 7. Check Free version view (show badges, disable clicks on premium layouts) (x)
 * 8. Render hub content layouts (x)
 * 9. Apply Blank Page Intro for HFS, Popup, Layout editors
 */