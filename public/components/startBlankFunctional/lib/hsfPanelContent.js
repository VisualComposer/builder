import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import vcCake from 'vc-cake'

const settingsStorage = vcCake.getStorage('settings')
const dataManager = vcCake.getService('dataManager')

function HsfPanelContent ({ onClick, type }) {
  const [inputValue, setInputValue] = useState(settingsStorage.state('pageTitle').get() || '')
  const [layoutType, setLayoutType] = useState(settingsStorage.state('layoutType').get())

  useEffect(() => {
    settingsStorage.state('layoutType').onChange(updateLayoutType)
    settingsStorage.state('pageTitle').onChange(updatePageTitle)
    return () => {
      settingsStorage.state('pageTitle').ignoreChange(updatePageTitle)
      settingsStorage.state('layoutType').ignoreChange(updateLayoutType)
    }
  }, [])

  const handleSubmit = e => {
    e && e.preventDefault()
    onClick(inputValue.trim())
  }

  const handleTitleChange = e => {
    e && e.preventDefault()
    const value = e.currentTarget.value
    settingsStorage.state('pageTitle').set(value)
  }

  const handleTemplateChange = e => {
    e && e.preventDefault()
    const value = e.currentTarget.value
    setLayoutType(value)
    settingsStorage.state('layoutType').set(value)
  }

  const updatePageTitle = title => {
    if (title || title === '') {
      setInputValue(title)
    }
  }

  const updateLayoutType = (type) => {
    if (type || type === '') {
      setLayoutType(type)
    }
  }

  const addLayoutSelect = () => {
    const editorType = dataManager.get('editorType')
    const localizations = dataManager.get('localizations')
    const postTemplateText = localizations ? localizations.postTemplateText : 'Singular layout'
    const archiveTemplateText = localizations ? localizations.archiveTemplateText : 'Archive layout'
    let layoutSelect = null

    if (editorType === 'vcv_layouts') {
      layoutSelect = (
        <div className='vcv-start-blank-template-type-wrapper'>
          <select
            className='vcv-start-blank-template-type'
            onChange={handleTemplateChange}
            value={layoutType}
          >
            <option value='postTemplate'>{postTemplateText}</option>
            <option value='archiveTemplate'>{archiveTemplateText}</option>
          </select>
        </div>
      )
    }

    return layoutSelect
  }

  const localizations = dataManager.get('localizations')
  const btnText = localizations ? localizations.startBuildingHFSButton : 'Start Building'
  const placeholder = localizations ? localizations.startPageHFSInputPlaceholder : '{name} Name'
  return (
    <div className='vcv-hfs-start-blank-container'>
      <form className='vcv-hfs-start-blank-form' onSubmit={handleSubmit}>
        <input
          className='vcv-start-blank-title-input'
          type='text'
          placeholder={placeholder.replace('{name}', type)}
          onChange={handleTitleChange}
          value={inputValue || ''}
          autoFocus
        />
        {addLayoutSelect()}
        <button className='vcv-hfs-start-blank-start-button' type='submit'>
          {btnText}
        </button>
      </form>
    </div>
  )
}

HsfPanelContent.propTypes = {
  type: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default HsfPanelContent
