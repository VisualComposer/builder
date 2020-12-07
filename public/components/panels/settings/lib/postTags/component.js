import React from 'react'
import { getStorage, getService } from 'vc-cake'
import AutoComplete from 'public/sources/attributes/autocomplete/Component'
import { getResponse } from 'public/tools/response'

const dataManager = getService('dataManager')
const settingsStorage = getStorage('settings')

export default class Tags extends React.Component {
  constructor (props) {
    super(props)

    let savedTags = dataManager.get('tags') || []
    if (savedTags && savedTags.length) {
      savedTags = savedTags.map(tag => tag.name)
    }

    const parsedCurrentTags = settingsStorage.state('tags').get() || savedTags
    const currentTags = parsedCurrentTags.map((item) => {
      return { name: item }
    })

    this.state = {
      value: currentTags,
      suggestions: [],
      loading: false,
      isActive: true
    }

    settingsStorage.state('tags').set(parsedCurrentTags)
    this.valueChangeHandler = this.valueChangeHandler.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
    this.loadSuggestions = this.loadSuggestions.bind(this)
  }

  valueChangeHandler (fieldKey, value) {
    const parsedValue = value.map((item) => {
      return item.name
    })
    this.setState({
      value: value,
      suggestions: []
    })
    settingsStorage.state('tags').set(parsedValue)
  }

  onInputChange (value) {
    this.loadSuggestions(value)
  }

  loadSuggestions (search) {
    const searchValue = search.trim()
    if (!searchValue || (searchValue.length < 2)) {
      return
    }
    this.setState({
      loading: true,
      suggestions: []
    })
    const ajax = getService('utils').ajax
    if (this.serverRequest) {
      this.serverRequest.abort()
    }

    this.serverRequest = ajax({
      'vcv-action': 'editors:settings:tags:autocomplete:findTag:adminNonce',
      'vcv-search': searchValue,
      'vcv-nonce': window.vcvNonce,
      'vcv-source-id': window.vcvSourceID
    }, (request) => {
      const response = getResponse(request.response)
      if (response.status && response.results && response.results.length) {
        const suggestions = response.results.filter((tag) => {
          let isNotAlreadySet = true
          this.state.value.forEach((activeTag) => {
            if (activeTag.name === tag) {
              isNotAlreadySet = false
            }
          })
          return isNotAlreadySet
        }).map((tag) => {
          return { name: tag }
        })
        this.setState({ suggestions: suggestions })
      }
      this.setState({ loading: false })
    })
  }

  render () {
    let spinnerHtml = null
    if (this.state.loading) {
      spinnerHtml = (
        <span className='vcv-ui-wp-spinner' />
      )
    }

    const localizations = dataManager.get('localizations')
    const tagsText = localizations ? localizations.tags : 'Tags'
    const isNewAutocomplete = true
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          {tagsText}
          {spinnerHtml}
        </span>
        <AutoComplete
          api={this.props.api}
          fieldKey='tags'
          updater={this.valueChangeHandler}
          value={this.state.value}
          suggestions={this.state.suggestions}
          options={{}}
          isNewAutocomplete={isNewAutocomplete}
          handleInputChange={this.onInputChange}
          isSuggestionsLoading={this.state.loading}
        />
      </div>
    )
  }
}
