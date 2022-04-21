import React from 'react'
import { getStorage, getService, env } from 'vc-cake'
import classNames from 'classnames'
import { getResponse } from 'public/tools/response'
import Tooltip from '../tooltip/tooltip'

const dataManager = getService('dataManager')
const dataProcessor = getService('dataProcessor')
const settingsStorage = getStorage('settings')

export default class Permalink extends React.Component {
  static localizations = dataManager.get('localizations')

  constructor (props) {
    super(props)

    const permalinkHtml = settingsStorage.state('permalinkHtml').get()
    const data = permalinkHtml ? Permalink.getPermalinkData(permalinkHtml) : null

    this.state = {
      baseUrlFirst: (data && data.baseUrlFirst) || null,
      baseUrlLast: (data && data.baseUrlLast) || null,
      permalink: (data && data.permalink) || null,
      permalinkFull: (data && data.permalinkFull) || null,
      editable: (data && data.editable) || false,
      value: (data && data.value) || null,
      urlFull: (data && data.urlFull) || null
    }

    this.handleKeyDownPreventNewLine = this.handleKeyDownPreventNewLine.bind(this)
    this.handleBlurUpdateContent = this.handleBlurUpdateContent.bind(this)
    this.updatePermalinkHtml = this.updatePermalinkHtml.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount () {
    settingsStorage.state('permalinkHtml').onChange(this.updatePermalinkHtml)
  }

  componentWillUnmount () {
    settingsStorage.state('permalinkHtml').ignoreChange(this.updatePermalinkHtml)
  }

  ajax (data, successCallback, failureCallback) {
    dataProcessor.appAllDone().then(() => {
      dataProcessor.appAdminServerRequest(data).then(successCallback, failureCallback)
    })
  }

  handleKeyDownPreventNewLine (event) {
    if (event.key === 'Enter') {
      event.preventDefault()
      event.nativeEvent.stopImmediatePropagation()
      event.stopPropagation()
      this.contentEditableElement.blur()
      this.handleBlurUpdateContent(event)
    }
  }

  setNewPermalinkHtml (value) {
    this.ajax(
      {
        'vcv-action': 'settings:parseSlug:adminNonce',
        'vcv-post-name': value,
        'vcv-page-title': settingsStorage.state('pageTitle').get()
      },
      this.loadSuccess.bind(this),
      this.loadFailed.bind(this)
    )
  }

  loadSuccess (request) {
    const responseData = getResponse(request)
    if (responseData && responseData.permalinkHtml) {
      settingsStorage.state('permalinkHtml').set(responseData.permalinkHtml)
    }
  }

  loadFailed (request) {
    const responseData = getResponse(request)
    if (env('VCV_DEBUG')) {
      console.warn(responseData)
    }
  }

  static getPermalinkData (permalinkHtml) {
    const range = document.createRange()
    const documentFragment = range.createContextualFragment(permalinkHtml)
    const editButtons = documentFragment.querySelector('#edit-slug-buttons')
    const editablePostNameHtml = documentFragment.querySelector('#editable-post-name-full')

    if (editButtons) {
      const url = documentFragment.querySelector('#sample-permalink a')
      const childNodes = url && url.childNodes
      return {
        editable: true,
        baseUrlFirst: childNodes && childNodes[0] && childNodes[0].textContent,
        baseUrlLast: childNodes && childNodes[2] && childNodes[2].textContent,
        permalink: childNodes && childNodes[1] && childNodes[1].innerHTML,
        permalinkFull: editablePostNameHtml && editablePostNameHtml.innerHTML,
        value: childNodes && childNodes[1] && childNodes[1].innerHTML
      }
    } else {
      const url = documentFragment.querySelector('#sample-permalink')
      return {
        editable: false,
        urlFull: url && url.innerText
      }
    }
  }

  handleBlurUpdateContent (event) {
    this.focused = false
    const value = event.currentTarget.innerText
    const postName = settingsStorage.state('postName').get()
    if (value !== postName) {
      this.setNewPermalinkHtml(value)
    }
    if (!value) {
      event.currentTarget.innerText = this.state.value
    }
  }

  updatePermalinkHtml (permalinkHtml) {
    const permalinkData = permalinkHtml ? Permalink.getPermalinkData(permalinkHtml) : null
    if (permalinkData) {
      this.setState(permalinkData)
      settingsStorage.state('postName').set(permalinkData.permalinkFull)
    }
  }

  handleClick () {
    this.setState({
      value: this.state.permalinkFull
    })
  }

  render () {
    const permalinkClass = classNames({
      'vcv-permalink-container': true,
      'vcv-permalink-container--editable': this.state.editable
    })

    let content = ''
    if (this.state.editable) {
      content = (
        <>
          <span className='vcv-permalink-base-url'>
            {this.state.baseUrlFirst}
          </span>
          <span
            className='vcv-permalink-editable'
            onBlur={this.handleBlurUpdateContent}
            onKeyDown={this.handleKeyDownPreventNewLine}
            onClick={this.handleClick}
            suppressContentEditableWarning
            contentEditable={this.state.editable}
            ref={span => { this.contentEditableElement = span }}
          >
            {this.state.value}
          </span>
          <span className='vcv-permalink-base-url'>
            {this.state.baseUrlLast}
          </span>
        </>
      )
    } else {
      content = (
        <span className='vcv-permalink-base-url'>
          {this.state.urlFull}
        </span>
      )
    }

    const modifyTheDestinationLinkToThePage = Permalink.localizations ? Permalink.localizations.modifyTheDestinationLinkToThePage : 'Modify the destination link to the page. Make sure to enable the option to set a custom permalink in WordPress Settings.'

    return (
      <div className={permalinkClass}>
        <span className='vcv-permalink-text'>{Permalink.localizations ? Permalink.localizations.permalink : 'Permalink'}:&nbsp;</span>
        <span className='vcv-permalink-link'>{content}</span>
        <Tooltip>
          {modifyTheDestinationLinkToThePage}
        </Tooltip>
      </div>
    )
  }
}
