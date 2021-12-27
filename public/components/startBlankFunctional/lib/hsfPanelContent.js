import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import vcCake from 'vc-cake'

const settingsStorage = vcCake.getStorage('settings')
const dataManager = vcCake.getService('dataManager')

function HsfPanelContent ({ onClick, type }) {
  const [inputValue, setInputValue] = useState(settingsStorage.state('pageTitle').get() || '')

  useEffect(() => {
    settingsStorage.state('pageTitle').onChange(updatePageTitle)
    return () => settingsStorage.state('pageTitle').ignoreChange(updatePageTitle)
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

  const updatePageTitle = title => {
    if (title || title === '') {
      setInputValue(title)
    }
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
