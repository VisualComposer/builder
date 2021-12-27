import React, { useEffect, useState } from 'react'
import vcCake from 'vc-cake'
import HsfPanelContent from './lib/hsfPanelContent'
import PropTypes from 'prop-types'

const workspaceStorage = vcCake.getStorage('workspace')
const workspaceSettings = workspaceStorage.state('settings')
const elementsStorage = vcCake.getStorage('elements')
const cook = vcCake.getService('cook')
const dataManager = vcCake.getService('dataManager')
const settingsStorage = vcCake.getStorage('settings')
let addedId, iframeWindow

function StartBlankPanel (props) {
  const [containerClasses, setContainerClasses] = useState('vcv-start-blank-container')

  useEffect(() => {
    setContainerClasses(containerClasses + ' vcv-ui-state--visible')
  }, [])

  const handleMouseUp = () => {
    const dragState = workspaceStorage.state('drag')
    if (dragState.get() && dragState.get().active) {
      dragState.set({ active: false })
    }
  }

  const handleStartClick = () => {
    const editorType = dataManager.get('editorType')
    const localizations = dataManager.get('localizations')
    const blankHeaderTitle = localizations.blankHeaderTitle ? localizations.blankHeaderTitle : 'Design your header here as a part of your layout. You can also download header templates from the Visual Composer Hub.'
    const blankFooterTitle = localizations.blankFooterTitle ? localizations.blankFooterTitle : 'Design your footer here as a part of your layout. You can also download footer templates from the Visual Composer Hub.'
    if (editorType === 'popup') {
      const cookElement = cook.get({ tag: 'popupRoot' }).toJS()
      const rowElement = cook.get({ tag: 'row', parent: cookElement.id }).toJS()
      elementsStorage.trigger('add', cookElement)
      elementsStorage.trigger('add', rowElement)
      addedId = cookElement.id
      const iframe = document.getElementById('vcv-editor-iframe')
      iframeWindow = iframe && iframe.contentWindow && iframe.contentWindow.window
      iframeWindow.vcv && iframeWindow.vcv.on('ready', openEditForm)
    } else if (editorType === 'vcv_layouts') {
      const layoutType = settingsStorage.state('layoutType').get()
      let elementTag
      if (layoutType === 'postTemplate') {
        elementTag = 'layoutContentArea'
      } else if (layoutType === 'archiveTemplate') {
        elementTag = 'layoutPostList'
      }

      const commonDesignOptions = { device: { all: { boxModel: { marginTop: '50px', marginBottom: '50px' } } } }
      const headerElement = cook.get({ tag: 'textBlock', designOptions: commonDesignOptions, output: `<p style="text-align:center;">${blankHeaderTitle}</p>` }).toJS()
      const initialElement = cook.get({ tag: elementTag }).toJS()
      const footerElement = cook.get({ tag: 'textBlock', designOptions: commonDesignOptions, output: `<p style="text-align:center;">${blankFooterTitle}</p>` }).toJS()
      elementsStorage.trigger('add', headerElement)
      elementsStorage.trigger('add', initialElement)
      elementsStorage.trigger('add', footerElement)
    } else {
      const settings = {
        action: 'add',
        element: {},
        tag: '',
        options: {}
      }
      workspaceSettings.set(settings)
    }
    props.unmountStartBlank()
  }

  const openEditForm = (action, id) => {
    if (action === 'add' && id === addedId) {
      workspaceStorage.trigger('edit', addedId, '')
      iframeWindow.vcv.off('ready', openEditForm)
    }
  }

  const localizations = dataManager.get('localizations')
  const editorType = dataManager.get('editorType')
  let type = editorType.replace('vcv_', '')
  type = editorType === 'vcv_archives' ? 'Archive Page' : type.charAt(0).toUpperCase() + type.slice(1)
  const headingPart1 = `${localizations ? localizations.blankPageTitleHeadingPart1 : 'Name Your '} ${type}`
  const headingPart2 = localizations ? localizations.blankPageTitleHeadingPart2 : 'and Start Building'

  return (
    <div className={containerClasses} onMouseUp={handleMouseUp}>
      <div className='vcv-start-blank-scroll-container'>
        <div className='vcv-start-blank-inner'>
          <div className='vcv-start-blank-heading-container'>
            <div className='vcv-start-blank-page-heading'>{headingPart1}</div>
            <div className='vcv-start-blank-page-heading'>{headingPart2}</div>
          </div>
          <HsfPanelContent
            type={type}
            onClick={handleStartClick}
          />
        </div>
      </div>
    </div>
  )
}

StartBlankPanel.propTypes = {
  unmountStartBlank: PropTypes.func.isRequired
}

export default StartBlankPanel
