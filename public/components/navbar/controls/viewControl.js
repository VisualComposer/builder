import React from 'react'
import NavbarContent from '../navbarContent'

import { setData, getService, getStorage } from 'vc-cake'

const PostData = getService('wordpress-post-data')
const dataManager = getService('dataManager')
const wordpressDataStorage = getStorage('wordpressData')
const workspaceStorage = getStorage('workspace')
const historyStorage = getStorage('history')
const settingsStorage = getStorage('settings')
const workspaceIFrame = workspaceStorage.state('iframe')

export default class ViewControl extends NavbarContent {
  static isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(window.navigator.platform)

  previewWindow = false
  previewWindowTarget = false
  editorType = dataManager.get('editorType')

  constructor (props) {
    super(props)
    this.handleClickSavePreview = this.handleClickSavePreview.bind(this)
    this.triggerPreviewClick = this.triggerPreviewClick.bind(this)
    this.updateButtons = this.updateButtons.bind(this)
    this.handleResetClick = this.handleResetClick.bind(this)
  }

  componentDidMount () {
    wordpressDataStorage.state('status').onChange(this.updateButtons)
    workspaceStorage.state('shortcutPreview').onChange(this.triggerPreviewClick)
  }

  updateButtons (data) {
    if (data && data.status === 'success') {
      this.forceUpdate()
    }
  }

  handleClickSavePreview (e) {
    e && e.preventDefault && e.preventDefault()
    setData('wp-preview', 'dopreview')

    wordpressDataStorage.state('status').ignoreChange(this.afterSaveChangeUrl)
    wordpressDataStorage.state('status').onChange(this.afterSaveChangeUrl)
    const previewUrl = PostData.previewUrl()

    if (!this.previewWindow || this.previewWindow.closed) {
      this.previewWindow = window.open(
        '',
        previewUrl
      )
    }
    this.previewWindowTarget = previewUrl

    const loadingView = '<style>\n' +
      '.vcv-loading-overlay {\n' +
      '  position: absolute;\n' +
      '  top: 0;\n' +
      '  left: 0;\n' +
      '  bottom: 0;\n' +
      '  right: 0;\n' +
      '  overflow: hidden;\n' +
      '  background: #fff;\n' +
      '  display: -webkit-box;\n' +
      '  display: -ms-flexbox;\n' +
      '  display: flex;\n' +
      '  -webkit-box-orient: vertical;\n' +
      '  -webkit-box-direction: normal;\n' +
      '      -ms-flex-direction: column;\n' +
      '          flex-direction: column;\n' +
      '  -webkit-box-pack: center;\n' +
      '      -ms-flex-pack: center;\n' +
      '          justify-content: center;\n' +
      '}\n' +
      '.vcv-loading-overlay-inner {\n' +
      '  display: -webkit-box;\n' +
      '  display: -ms-flexbox;\n' +
      '  display: flex;\n' +
      '  -webkit-box-orient: vertical;\n' +
      '  -webkit-box-direction: normal;\n' +
      '      -ms-flex-direction: column;\n' +
      '          flex-direction: column;\n' +
      '  -ms-flex-line-pack: center;\n' +
      '      align-content: center;\n' +
      '  -webkit-box-align: center;\n' +
      '      -ms-flex-align: center;\n' +
      '          align-items: center;\n' +
      '}\n' +
      '.vcv-loading-dots-container {\n' +
      '  width: 60px;\n' +
      '  height: 60px;\n' +
      '  text-align: center;\n' +
      '  -webkit-animation: vcvDotsRotate 2s infinite linear;\n' +
      '          animation: vcvDotsRotate 2s infinite linear;\n' +
      '}\n' +
      '.vcv-loading-dots-container .vcv-loading-dot {\n' +
      '  width: 60%;\n' +
      '  height: 60%;\n' +
      '  display: inline-block;\n' +
      '  position: absolute;\n' +
      '  top: 0;\n' +
      '  background-color: #eee;\n' +
      '  border-radius: 100%;\n' +
      '  -webkit-animation: vcvDotsBounce 2s infinite ease-in-out;\n' +
      '          animation: vcvDotsBounce 2s infinite ease-in-out;\n' +
      '}\n' +
      '.vcv-loading-dots-container .vcv-loading-dot-2 {\n' +
      '  top: auto;\n' +
      '  bottom: 0;\n' +
      '  -webkit-animation-delay: -1s;\n' +
      '          animation-delay: -1s;\n' +
      '}\n' +
      '@-webkit-keyframes vcvDotsRotate {\n' +
      '  100% {\n' +
      '    -webkit-transform: rotate(360deg);\n' +
      '            transform: rotate(360deg);\n' +
      '  }\n' +
      '}\n' +
      '@keyframes vcvDotsRotate {\n' +
      '  100% {\n' +
      '    -webkit-transform: rotate(360deg);\n' +
      '            transform: rotate(360deg);\n' +
      '  }\n' +
      '}\n' +
      '@-webkit-keyframes vcvDotsBounce {\n' +
      '  0%,\n' +
      '  100% {\n' +
      '    -webkit-transform: scale(0);\n' +
      '            transform: scale(0);\n' +
      '  }\n' +
      '  50% {\n' +
      '    -webkit-transform: scale(1);\n' +
      '            transform: scale(1);\n' +
      '  }\n' +
      '}\n' +
      '@keyframes vcvDotsBounce {\n' +
      '  0%,\n' +
      '  100% {\n' +
      '    -webkit-transform: scale(0);\n' +
      '            transform: scale(0);\n' +
      '  }\n' +
      '  50% {\n' +
      '    -webkit-transform: scale(1);\n' +
      '            transform: scale(1);\n' +
      '  }\n' +
      '}\n' +
      '</style>\n' +
      '<div class="vcv-loading-overlay">\n' +
      '                        <div class="vcv-loading-overlay-inner">\n' +
      '                            <div class="vcv-loading-dots-container">\n' +
      '                                <div class="vcv-loading-dot vcv-loading-dot-1"></div>\n' +
      '                                <div class="vcv-loading-dot vcv-loading-dot-2"></div>\n' +
      '                            </div>\n' +
      '                        </div>\n' +
      '                    </div>'

    this.previewWindow.document.write(loadingView)
    wordpressDataStorage.trigger('save', { inherit: true }, 'wordpressAdminControl')
  }

  afterSaveChangeUrl = (data) => {
    const { status } = data
    if (status === 'saving' && this.previewOpened && !this.previewWindow.closed) {
      this.previewWindow.location.href = this.previewWindowTarget
      this.previewWindow.blur()
      this.previewWindow.focus()
    } else if (status === 'success') {
      this.previewWindow.location.href = this.previewWindowTarget
      wordpressDataStorage.state('status').ignoreChange(this.afterSaveChangeUrl)
      this.previewOpened = true
      setData('wp-preview', '')
    } else if (status === 'failed') {
      wordpressDataStorage.state('status').ignoreChange(this.afterSaveChangeUrl)
      setData('wp-preview', '')
    }
  }

  triggerPreviewClick (data) {
    if (data) {
      this.previewBtn.click()
      workspaceStorage.state('shortcutPreview').set(false)
    }
  }

  handleResetClick () {
    workspaceStorage.state('settings').set(false)

    window.setTimeout(() => {
      historyStorage.state('canUndo').get() && historyStorage.trigger('reset')
    }, 50)

    const initialPageTemplate = dataManager.get('pageTemplatesLayoutsCurrent')
    const lastSavedPageTemplate = settingsStorage.state('pageTemplate').get()

    const initialHeaderTemplate = dataManager.get('headerTemplates') && dataManager.get('headerTemplates').current
    const lastSavedHeaderTemplate = settingsStorage.state('headerTemplate').get()

    const initialSidebarTemplate = dataManager.get('sidebarTemplates') && dataManager.get('sidebarTemplates').current
    const lastSavedSidebarTemplate = settingsStorage.state('sidebarTemplate').get()

    const initialFooterTemplate = dataManager.get('footerTemplates') && dataManager.get('footerTemplates').current
    const lastSavedFooterTemplate = settingsStorage.state('footerTemplate').get()

    if (
      (initialPageTemplate && (initialPageTemplate.value !== lastSavedPageTemplate.value || initialPageTemplate.type !== lastSavedPageTemplate.type || (initialPageTemplate.stretchedContent !== lastSavedPageTemplate.stretchedContent))) ||
      (initialHeaderTemplate && initialHeaderTemplate !== lastSavedHeaderTemplate) ||
      (initialSidebarTemplate && initialSidebarTemplate !== lastSavedSidebarTemplate) ||
      (initialFooterTemplate && initialFooterTemplate !== lastSavedFooterTemplate)
    ) {
      window.vcvLastLoadedPageTemplate = initialPageTemplate
      window.vcvLastLoadedHeaderTemplate = initialHeaderTemplate
      window.vcvLastLoadedSidebarTemplate = initialSidebarTemplate
      window.vcvLastLoadedFooterTemplate = initialFooterTemplate

      workspaceIFrame.set({
        type: 'reload',
        template: initialPageTemplate,
        header: initialHeaderTemplate,
        sidebar: initialSidebarTemplate,
        footer: initialFooterTemplate
      })
      settingsStorage.state('skipBlank').set(true)
    }
  }

  render () {
    const localizations = dataManager.get('localizations')
    const { preview, previewChanges, reset } = localizations

    let viewButton = ''
    if (PostData.isViewable() && PostData.isPublished()) {
      viewButton = (
        <a
          className='vcv-ui-navbar-control'
          title={PostData.viewText()}
          href={PostData.permalink()}
          data-vcv-control='view'
          target='_blank'
        >
          <span className='vcv-ui-navbar-control-content'>{PostData.viewText()}</span>
        </a>
      )
    }

    const previewText = PostData.isPublished() ? previewChanges : preview
    const previewTitleText = ViewControl.isMacLike ? previewText + ' (⌘⇧P)' : previewText + ' (Ctrl + Shift + P)'
    const previewButton = (
      <span
        className='vcv-ui-navbar-control'
        title={previewTitleText}
        onClick={this.handleClickSavePreview}
        ref={(previewBtn) => { this.previewBtn = previewBtn }}
        data-vcv-control='preview'
      >
        <span className='vcv-ui-navbar-control-content'>{previewText}</span>
      </span>
    )

    let resetButton = null
    if (this.editorType === 'vcv_tutorials') {
      resetButton = (
        <span
          className='vcv-ui-navbar-control'
          onClick={this.handleResetClick}
          title={reset}
        >
          <span className='vcv-ui-navbar-control-content'>{reset}</span>
        </span>
      )
    }

    return (
      PostData.vcvCustomPostType() ? (
        <div className='vcv-ui-navbar-controls-set'>
          {resetButton}
        </div>
      ) : (
        <div className='vcv-ui-navbar-controls-set'>
          {previewButton}
          {viewButton}
        </div>
      )
    )
  }
}
