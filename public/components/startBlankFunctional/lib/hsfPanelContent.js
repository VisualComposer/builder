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

  const updatePageTitle = arg => {
    // checks if arg is an event object
    if (arg && arg.preventDefault) {
      arg.preventDefault()
      const value = arg.currentTarget.value
      settingsStorage.state('pageTitle').set(value)
    } else {
      if (arg || arg === '') {
        setInputValue(arg)
      }
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
          onChange={updatePageTitle}
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
