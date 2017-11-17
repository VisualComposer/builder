import React from 'react'
import classNames from 'classnames'
import { env, getService, getStorage } from 'vc-cake'
import ElementControl from '../../addElement/lib/elementControl'

const hubElementsService = getService('hubElements')
const workspaceStorage = getStorage('workspace')
const workspaceNotifications = workspaceStorage.state('notifications')

export default class TeaserElementControl extends ElementControl {
  constructor (props) {
    super(props)
    const elements = hubElementsService.all()

    this.state = {
      allowDownload: window.VCV_HUB_ALLOW_DOWNLOAD ? window.VCV_HUB_ALLOW_DOWNLOAD() : false,
      elementState: typeof elements[ this.props.tag ] !== 'undefined' ? 'success' : 'inactive'
    }
    this.addElement = this.addElement.bind(this)
    this.downloadElement = this.downloadElement.bind(this)
    this.downloadTemplate = this.downloadTemplate.bind(this)
    this.ajax = null
  }

  componentWillUnmount () {
    if (this.ajax) {
      this.ajax = null
      this.props.cancelDownload(this.props.element.tag)
    }
  }

  downloadElement (e) {
    if (this.ajax || !this.state.allowDownload) {
      return
    }
    let tag = this.props.element.tag
    let bundle = 'element/' + tag.charAt(0).toLowerCase() + tag.substr(1, tag.length - 1)
    if (this.props.element.bundle) {
      bundle = this.props.element.bundle
    }
    let name = this.props.element.name
    this.setState({ elementState: 'downloading' })
    const localizations = window.VCV_I18N && window.VCV_I18N()

    let data = {
      'vcv-action': 'hub:download:element:adminNonce',
      'vcv-bundle': bundle,
      'vcv-nonce': window.vcvNonce
    }
    let successMessage = localizations.successElementDownload || '{name} has been successfully downloaded from the Visual Composer Hub and added to your library.'

    let tries = 0
    let tryDownload = () => {
      let successCallback = (response, cancelled) => {
        this.ajax = null
        try {
          let jsonResponse = window.JSON.parse(response)
          if (jsonResponse && jsonResponse.status && jsonResponse.elements) {
            workspaceNotifications.set({
              position: 'bottom',
              transparent: true,
              rounded: true,
              text: successMessage.replace('{name}', name),
              time: 3000
            })
            this.buildVariables(jsonResponse.variables || [])
            if (Array.isArray(jsonResponse.elements)) {
              jsonResponse.elements.forEach((element) => {
                element.tag = element.tag.replace('element/', '')
                getStorage('hubElements').trigger('add', element, true)
              })
            }

            !cancelled && this.setState({ elementState: 'success' })
          } else {
            tries++
            console.warn('failed to download element status is false', jsonResponse, response)
            if (tries < 2) {
              tryDownload()
            } else {
              this.ajax = null
              let errorMessage = localizations.licenseErrorElementDownload || 'Failed to download element (license is expired or request to account has timed out).'
              if (jsonResponse && jsonResponse.message) {
                errorMessage = jsonResponse.message
              } else if (jsonResponse && jsonResponse.details && jsonResponse.details.message) {
                errorMessage = jsonResponse.details.message
              }
              console.warn('failed to download element status is false', errorMessage, response)
              workspaceNotifications.set({
                type: 'error',
                text: errorMessage,
                showCloseButton: 'true',
                icon: 'vcv-ui-icon vcv-ui-icon-error',
                time: 5000
              })

              !cancelled && this.setState({ elementState: 'failed' })
            }
          }
        } catch (e) {
          tries++
          console.warn('failed to parse download response', e, response)
          if (tries < 2) {
            tryDownload()
          } else {
            this.ajax = null
            workspaceNotifications.set({
              type: 'error',
              text: localizations.defaultErrorElementDownload || 'Failed to download element.',
              showCloseButton: 'true',
              icon: 'vcv-ui-icon vcv-ui-icon-error',
              time: 5000
            })

            !cancelled && this.setState({ elementState: 'failed' })
          }
        }
      }
      let errorCallback = (response, cancelled) => {
        tries++
        console.warn('failed to download element general server error', response)
        if (tries < 2) {
          tryDownload()
        } else {
          this.ajax = null
          workspaceNotifications.set({
            type: 'error',
            text: localizations.defaultErrorElementDownload || 'Failed to download element.',
            showCloseButton: 'true',
            icon: 'vcv-ui-icon vcv-ui-icon-error',
            time: 5000
          })

          !cancelled && this.setState({ elementState: 'failed' })
        }
      }
      this.ajax = this.props.startDownload(tag, data, successCallback, errorCallback)
    }
    tryDownload()
  }

  downloadTemplate (e) {
    if (this.ajax || !this.state.allowDownload) {
      return
    }
    let bundle = this.props.element.bundle
    let name = this.props.element.name
    this.setState({ elementState: 'downloading' })
    const localizations = window.VCV_I18N && window.VCV_I18N()

    let data = {
      'vcv-action': 'hub:download:template:adminNonce',
      'vcv-bundle': bundle,
      'vcv-nonce': window.vcvNonce
    }
    let tag = bundle // for queue
    let successMessage = localizations.successTemplateDownload || '{name} has been successfully downloaded from the Visual Composer Hub and added to your library.'

    let tries = 0
    let tryDownload = () => {
      let successCallback = (response, cancelled) => {
        this.ajax = null
        try {
          let jsonResponse = window.JSON.parse(response)
          if (jsonResponse && jsonResponse.status && jsonResponse.elements) {
            workspaceNotifications.set({
              position: 'bottom',
              transparent: true,
              rounded: true,
              text: successMessage.replace('{name}', name),
              time: 3000
            })
            this.buildVariables(jsonResponse.variables || [])
            // Initialize template depended elements
            if (Array.isArray(jsonResponse.elements)) {
              jsonResponse.elements.forEach((element) => {
                element.tag = element.tag.replace('element/', '')
                getStorage('hubElements').trigger('add', element, true)
              })
            }
            // TODO: add template to templates list

            !cancelled && this.setState({ elementState: 'success' })
          } else {
            tries++
            console.warn('failed to download template status is false', jsonResponse, response)
            if (tries < 2) {
              tryDownload()
            } else {
              this.ajax = null
              let errorMessage = localizations.licenseErrorElementDownload || 'Failed to download template (license is expired or request to account has timed out).'
              if (jsonResponse && jsonResponse.message) {
                errorMessage = jsonResponse.message
              } else if (jsonResponse && jsonResponse.details && jsonResponse.details.message) {
                errorMessage = jsonResponse.details.message
              }
              console.warn('failed to download template status is false', errorMessage, response)
              workspaceNotifications.set({
                type: 'error',
                text: errorMessage,
                showCloseButton: 'true',
                icon: 'vcv-ui-icon vcv-ui-icon-error',
                time: 5000
              })

              !cancelled && this.setState({ elementState: 'failed' })
            }
          }
        } catch (e) {
          tries++
          console.warn('failed to parse download response', e, response)
          if (tries < 2) {
            tryDownload()
          } else {
            this.ajax = null
            workspaceNotifications.set({
              type: 'error',
              text: localizations.defaultErrorTemplateDownload || 'Failed to download template.',
              showCloseButton: 'true',
              icon: 'vcv-ui-icon vcv-ui-icon-error',
              time: 5000
            })

            !cancelled && this.setState({ elementState: 'failed' })
          }
        }
      }
      let errorCallback = (response, cancelled) => {
        tries++
        console.warn('failed to download template general server error', response)
        if (tries < 2) {
          tryDownload()
        } else {
          this.ajax = null
          workspaceNotifications.set({
            type: 'error',
            text: localizations.defaultErrorTemplateDownload || 'Failed to download template.',
            showCloseButton: 'true',
            icon: 'vcv-ui-icon vcv-ui-icon-error',
            time: 5000
          })

          !cancelled && this.setState({ elementState: 'failed' })
        }
      }
      this.ajax = this.props.startDownload(tag, data, successCallback, errorCallback)
    }
    tryDownload()
  }

  buildVariables (variables) {
    if (variables.length) {
      variables.forEach((item) => {
        if (typeof window[ item.key ] === 'undefined') {
          if (item.type === 'constant') {
            window[ item.key ] = function () { return item.value }
          } else {
            window[ item.key ] = item.value
          }
        }
      })
    }
  }

  render () {
    let { name, element } = this.props
    let { previewVisible, previewStyle, elementState } = this.state

    let itemElementClasses = classNames({
      'vcv-ui-item-element': true,
      'vcv-ui-item-element-inactive': elementState !== 'success'
    })

    let listItemClasses = classNames({
      'vcv-ui-item-list-item': true,
      'vcv-ui-item-list-item--inactive': false
    })
    let nameClasses = classNames({
      'vcv-ui-item-badge vcv-ui-badge--success': false,
      'vcv-ui-item-badge vcv-ui-badge--warning': false
    })

    let previewClasses = classNames({
      'vcv-ui-item-preview-container': true,
      'vcv-ui-state--visible': previewVisible
    })

    let publicPathThumbnail = element.metaThumbnailUrl
    let publicPathPreview = element.metaPreviewUrl

    let overlayOutput = <span className='vcv-ui-item-add vcv-ui-icon vcv-ui-icon-lock' />
    if (env('HUB_TEASER_ELEMENT_DOWNLOAD')) {
      let iconClasses = classNames({
        'vcv-ui-item-add': true,
        'vcv-ui-item-add-hub': true,
        'vcv-ui-icon': true,
        'vcv-ui-icon-download': elementState === 'inactive' || elementState === 'failed',
        'vcv-ui-icon-add': elementState === 'success',
        'vcv-ui-wp-spinner-light': elementState === 'downloading',
        'vcv-ui-icon vcv-ui-icon-lock': !this.state.allowDownload && this.state.elementState === 'inactive'
      })
      let action = this.addElement
      if(this.props.type === 'element') {
        if(elementState !== 'success') {
          action = this.downloadElement
        }
      } else {
        // TODO: Check if template already exists
        action = this.downloadTemplate
      }
      overlayOutput = <span className={iconClasses} onClick={action} />
    }

    return (
      <li className={listItemClasses}>
        <span className={itemElementClasses}
          onMouseEnter={this.showPreview}
          onMouseLeave={this.hidePreview}
          title={name}>
          <span className='vcv-ui-item-element-content'>
            <img className='vcv-ui-item-element-image' src={publicPathThumbnail} alt='' />
            <span className='vcv-ui-item-overlay'>
              {overlayOutput}
            </span>
          </span>
          <span className='vcv-ui-item-element-name'>
            <span className={nameClasses}>
              {name}
            </span>
          </span>
          <figure className={previewClasses} style={previewStyle}>
            <img className='vcv-ui-item-preview-image' src={publicPathPreview} alt='' />
            <figcaption className='vcv-ui-item-preview-caption'>
              <div className='vcv-ui-item-preview-text'>
                {element.metaDescription}
              </div>
            </figcaption>
          </figure>
        </span>
      </li>
    )
  }
}
