import React from 'react'
import classNames from 'classnames'
import { env, getService, getStorage } from 'vc-cake'
import ElementControl from '../../addElement/lib/elementControl'

const hubElementsService = getService('hubElements')
const templatesService = getService('myTemplates')
const workspaceStorage = getStorage('workspace')
const workspaceNotifications = workspaceStorage.state('notifications')
const elementsStorage = getStorage('elements')
const workspaceSettings = workspaceStorage.state('settings')
const hubElementsStorage = getStorage('hubElements')
const hubTemplateStorage = getStorage('hubTemplates')

export default class TeaserElementControl extends ElementControl {
  constructor (props) {
    super(props)
    const elements = hubElementsService.all()

    let elementState
    if (this.props.type === 'element') {
      if (env('HUB_DOWNLOAD_SPINNER')) {
        const downloadingItems = workspaceStorage.state('downloadingItems').get() || []
        if (downloadingItems.includes(props.tag)) {
          elementState = 'downloading'
        } else {
          elementState = typeof elements[ this.props.tag ] !== 'undefined' ? 'success' : 'inactive'
        }
      } else {
        elementState = typeof elements[ this.props.tag ] !== 'undefined' ? 'success' : 'inactive'
      }
    } else {
      if (env('HUB_DOWNLOAD_SPINNER')) {
        const downloadingItems = workspaceStorage.state('downloadingItems').get() || []
        const tag = this.props.element.bundle.replace('template/', '')
        if (downloadingItems.includes(tag)) {
          elementState = 'downloading'
        } else {
          let hubTemplates = templatesService.hub()
          elementState = 'inactive'
          for (let i = 0; i < hubTemplates.length; i++) {
            if (hubTemplates[ i ].bundle === this.props.element.bundle) {
              elementState = 'success'
              break
            }
          }
        }
      } else {
        let hubTemplates = templatesService.hub()
        elementState = 'inactive'
        for (let i = 0; i < hubTemplates.length; i++) {
          if (hubTemplates[ i ].bundle === this.props.element.bundle) {
            elementState = 'success'
            break
          }
        }
      }
    }
    this.state = {
      allowDownload: window.VCV_HUB_ALLOW_DOWNLOAD ? window.VCV_HUB_ALLOW_DOWNLOAD() : false,
      elementState: elementState
    }
    this.addElement = this.addElement.bind(this)
    this.downloadElement = this.downloadElement.bind(this)
    this.downloadTemplate = this.downloadTemplate.bind(this)
    this.addTemplate = this.addTemplate.bind(this)
    this.downloadingItemOnChange = this.downloadingItemOnChange.bind(this)
    this.ajax = null
  }

  componentDidMount () {
    if (env('HUB_DOWNLOAD_SPINNER') && this.state.elementState === 'downloading') {
      workspaceStorage.state('downloadingItems').onChange(this.downloadingItemOnChange)
    }
  }

  componentWillUnmount () {
    if (this.ajax) {
      this.ajax = null
      this.props.cancelDownload(this.props.element.tag)
    }
    if (env('HUB_DOWNLOAD_SPINNER')) {
      workspaceStorage.state('downloadingItems').ignoreChange(this.downloadingItemOnChange)
    }
  }

  downloadingItemOnChange (data) {
    let tag = this.props.type === 'element' ? this.props.tag : this.props.element.bundle.replace('template/', '')
    if (!data.includes(tag)) {
      let downloaded = this.props.type === 'element' ? hubElementsService.get(tag) : templatesService.findBy('bundle', this.props.element.bundle)
      this.setState({ elementState: downloaded ? 'success' : 'failed' })
      workspaceStorage.state('downloadingItems').ignoreChange(this.downloadingItemOnChange)
    }
  }

  downloadElement (e) {
    if (this.ajax || !this.state.allowDownload) {
      return
    }
    if (env('HUB_DOWNLOAD_SPINNER')) {
      this.setState({ elementState: 'downloading' })
      workspaceStorage.state('downloadingItems').onChange(this.downloadingItemOnChange)
      hubElementsStorage.trigger('downloadElement', this.props.element)
    } else {
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
      let successMessage = localizations.successElementDownload || '{name} has been successfully downloaded from the Visual Composer Hub and added to your library'

      let tries = 0
      let tryDownload = () => {
        let successCallback = (response, cancelled) => {
          this.ajax = null
          try {
            let jsonResponse = window.JSON.parse(response)
            if (jsonResponse && jsonResponse.status) {
              workspaceNotifications.set({
                position: 'bottom',
                transparent: true,
                rounded: true,
                text: successMessage.replace('{name}', name),
                time: 3000
              })
              this.buildVariables(jsonResponse.variables || [])
              if (jsonResponse.elements && Array.isArray(jsonResponse.elements)) {
                jsonResponse.elements.forEach((element) => {
                  element.tag = element.tag.replace('element/', '')
                  getStorage('hubElements').trigger('add', element, true)
                })
              }

              !cancelled && this.setState({ elementState: 'success' })
            } else {
              if (!cancelled) {
                tries++
                console.warn('failed to download element status is false', jsonResponse, response)
                if (tries < 2) {
                  tryDownload()
                } else {
                  this.ajax = null
                  let errorMessage = localizations.licenseErrorElementDownload || 'Failed to download element (license is expired or request to account has timed out).'
                  if (jsonResponse && jsonResponse.message) {
                    errorMessage = jsonResponse.message
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
              } else {
                let errorMessage = localizations.licenseErrorElementDownload || 'Failed to download element (license is expired or request to account has timed out).'
                console.warn('failed to download element request cancelled', errorMessage, response)
                workspaceNotifications.set({
                  type: 'error',
                  text: errorMessage,
                  showCloseButton: 'true',
                  icon: 'vcv-ui-icon vcv-ui-icon-error',
                  time: 5000
                })
              }
            }
          } catch (e) {
            if (!cancelled) {
              tries++
              console.warn('failed to parse download response', e, response)
              if (tries < 2) {
                tryDownload()
              } else {
                this.ajax = null
                workspaceNotifications.set({
                  type: 'error',
                  text: localizations.defaultErrorElementDownload || 'Failed to download element',
                  showCloseButton: 'true',
                  icon: 'vcv-ui-icon vcv-ui-icon-error',
                  time: 5000
                })

                !cancelled && this.setState({ elementState: 'failed' })
              }
            } else {
              console.warn('failed to parse download response request cancelled', e, response)
              workspaceNotifications.set({
                type: 'error',
                text: localizations.defaultErrorElementDownload || 'Failed to download element',
                showCloseButton: 'true',
                icon: 'vcv-ui-icon vcv-ui-icon-error',
                time: 5000
              })
            }
          }
        }
        let errorCallback = (response, cancelled) => {
          if (!cancelled) {
            tries++
            console.warn('failed to download element general server error', response)
            if (tries < 2) {
              tryDownload()
            } else {
              this.ajax = null
              workspaceNotifications.set({
                type: 'error',
                text: localizations.defaultErrorElementDownload || 'Failed to download element',
                showCloseButton: 'true',
                icon: 'vcv-ui-icon vcv-ui-icon-error',
                time: 5000
              })

              !cancelled && this.setState({ elementState: 'failed' })
            }
          } else {
            console.warn('failed to download element general server error request cancelled', response)
            workspaceNotifications.set({
              type: 'error',
              text: localizations.defaultErrorElementDownload || 'Failed to download element',
              showCloseButton: 'true',
              icon: 'vcv-ui-icon vcv-ui-icon-error',
              time: 5000
            })
          }
        }
        this.ajax = this.props.startDownload(tag, data, successCallback, errorCallback)
      }
      tryDownload()
    }
  }

  downloadTemplate (e) {
    if (this.ajax || !this.state.allowDownload) {
      return
    }
    if (env('HUB_DOWNLOAD_SPINNER')) {
      this.setState({ elementState: 'downloading' })
      workspaceStorage.state('downloadingItems').onChange(this.downloadingItemOnChange)
      hubTemplateStorage.trigger('downloadTemplate', this.props.element)
    } else {
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
      let successMessage = localizations.successTemplateDownload || '{name} has been successfully downloaded from the Visual Composer Hub and added to your library'

      let tries = 0
      let tryDownload = () => {
        let successCallback = (response, cancelled) => {
          this.ajax = null
          try {
            let jsonResponse = window.JSON.parse(response)
            if (jsonResponse && jsonResponse.status) {
              workspaceNotifications.set({
                position: 'bottom',
                transparent: true,
                rounded: true,
                text: successMessage.replace('{name}', name),
                time: 3000
              })
              this.buildVariables(jsonResponse.variables || [])
              // Initialize template depended elements
              if (jsonResponse.elements && Array.isArray(jsonResponse.elements)) {
                jsonResponse.elements.forEach((element) => {
                  element.tag = element.tag.replace('element/', '')
                  getStorage('hubElements').trigger('add', element, true)
                })
              }
              if (jsonResponse.templates) {
                let template = jsonResponse.templates[ 0 ]
                template.id = template.id.toString()
                getStorage('templates').trigger('add', 'hub', template)
              }

              !cancelled && this.setState({ elementState: 'success' })
            } else {
              if (!cancelled) {
                tries++
                console.warn('failed to download template status is false', jsonResponse, response)
                if (tries < 2) {
                  tryDownload()
                } else {
                  this.ajax = null
                  let errorMessage = localizations.licenseErrorElementDownload || 'Failed to download template (license is expired or request to account has timed out).'
                  if (jsonResponse && jsonResponse.message) {
                    errorMessage = jsonResponse.message
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
              } else {
                let errorMessage = localizations.licenseErrorElementDownload || 'Failed to download template (license is expired or request to account has timed out).'
                console.warn('failed to download template request cancelled', errorMessage, response)
                workspaceNotifications.set({
                  type: 'error',
                  text: errorMessage,
                  showCloseButton: 'true',
                  icon: 'vcv-ui-icon vcv-ui-icon-error',
                  time: 5000
                })
              }
            }
          } catch (e) {
            if (!cancelled) {
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
            } else {
              console.warn('failed to parse download response request is cancelled', e, response)
              workspaceNotifications.set({
                type: 'error',
                text: localizations.defaultErrorTemplateDownload || 'Failed to download template.',
                showCloseButton: 'true',
                icon: 'vcv-ui-icon vcv-ui-icon-error',
                time: 5000
              })
            }
          }
        }
        let errorCallback = (response, cancelled) => {
          if (!cancelled) {
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
          } else {
            console.warn('failed to download template general server error request cancelled', response)
            workspaceNotifications.set({
              type: 'error',
              text: localizations.defaultErrorTemplateDownload || 'Failed to download template.',
              showCloseButton: 'true',
              icon: 'vcv-ui-icon vcv-ui-icon-error',
              time: 5000
            })
          }
        }
        this.ajax = this.props.startDownload(tag, data, successCallback, errorCallback)
      }
      tryDownload()
    }
  }

  addTemplate (e) {
    let hubTemplates = templatesService.hub()
    let data = {}
    for (let i = 0; i < hubTemplates.length; i++) {
      if (hubTemplates[ i ].bundle === this.props.element.bundle) {
        data = hubTemplates[ i ].data
        break
      }
    }
    elementsStorage.trigger('merge', data)
    workspaceSettings.set(false)
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

    let itemOverlayClasses = classNames({
      'vcv-ui-item-overlay': true,
      'vcv-ui-item-downloading': elementState === 'downloading'
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
      if (this.props.type === 'element') {
        if (elementState !== 'success') {
          action = this.downloadElement
        }
      } else {
        action = this.addTemplate
        if (elementState !== 'success') {
          action = this.downloadTemplate
        }
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
            <img className='vcv-ui-item-element-image' src={publicPathThumbnail} alt={name} />
            <span className={itemOverlayClasses}>
              {overlayOutput}
            </span>
          </span>
          <span className='vcv-ui-item-element-name'>
            <span className={nameClasses}>
              {name}
            </span>
          </span>
          <figure className={previewClasses} style={previewStyle}>
            <img className='vcv-ui-item-preview-image' src={publicPathPreview} alt={name} />
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
