import React from 'react'
import PropTypes from 'prop-types'

export default class WpbakeryIframe extends React.Component {
  static propTypes = {
    close: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      loadingEditor: true,
      value: props.value
    }

    this.editorIframeLoaded = this.editorIframeLoaded.bind(this)
    this.handleSaveClick = this.handleSaveClick.bind(this)
  }

  editorIframeLoaded () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const wpbakeryAttrError = localizations ? localizations.wpbakeryAttrError : 'Failed to load WPBakery Edit Form, please check WPBakery Page Builder Plugin.'
    const ifrWin = this.refs.iframeRef.contentWindow
    if (!ifrWin.vc) {
      window.alert(wpbakeryAttrError)
      this.props.close()
    }

    // Set value
    let preModel
    if (!ifrWin.vc_api_version < 2) {
      let parsedModels = ifrWin.vc.storage.parseContent({}, this.state.value)
      preModel = Object.values(parsedModels)[ 0 ]
    } else {
      let parsedModels = ifrWin.vc.storage.parseContent([], this.state.value)
      preModel = parsedModels[ 0 ]
    }
    const multipleShortcodesRegex = window.wp.shortcode.regexp(window.VCV_API_WPBAKERY_WPB_MAP().join('|'))
    const localShortcodesRegex = new RegExp(multipleShortcodesRegex.source)
    let preModelData = this.state.value.match(localShortcodesRegex)

    const tag = preModelData[ 2 ]
    const mapped = ifrWin.vc.getMapped(tag)
    const isContainer = ifrWin._.isObject(mapped) && ((ifrWin._.isBoolean(mapped.is_container) && mapped.is_container === true) || !ifrWin._.isEmpty(
      mapped.as_parent))
    const hasContent = !(ifrWin._.isUndefined(ifrWin.vc.getParamSettings(tag, 'content')) && !isContainer)

    // Set params.content
    if (hasContent) {
      preModel.params.content = ''
    }
    if (preModelData && preModelData[ 5 ]) {
      preModel.params.content = preModelData[ 5 ]
    }
    // eslint-disable-next-line new-cap
    let model = new ifrWin.vc.shortcode(preModel)

    // Prepare for render event and replace save button with custom
    ifrWin.vc.edit_element_block_view.on('afterRender', () => {
      // Create custom save button and hide loading
      let $saveBtn = ifrWin.vc.edit_element_block_view.$el.find('[data-vc-ui-element="button-save"]').hide()
      let $newSaveBtn = ifrWin.jQuery(`<span class="vc_general vc_ui-button vc_ui-button-action vc_ui-button-shape-rounded vc_ui-button-fw" data-vc-ui-element="button-save-custom"></span>`)
      $newSaveBtn.text($saveBtn.text())
      $newSaveBtn.insertAfter($saveBtn)
      // Bind save event for custom save button
      $newSaveBtn.click(this.handleSaveClick)
      this.setState({
        loadingEditor: false
      })
    })
    ifrWin.vc.edit_element_block_view.on('save', this.handleSaveClick)
    ifrWin.vc.edit_element_block_view.on('hide', this.props.close)
    ifrWin.vc.edit_element_block_view.render(model)
  }

  handleSaveClick () {
    let ifrWin = this.refs.iframeRef.contentWindow
    const editForm = ifrWin.vc.edit_element_block_view
    const tag = editForm.model.get('shortcode')
    let params = editForm.getParams()
    let mergedParams = ifrWin._.extend({}, ifrWin.vc.getMergedParams(tag, params))
    if (!ifrWin._.isUndefined(params.content)) {
      mergedParams.content = params.content
    }
    const mapped = ifrWin.vc.getMapped(tag)

    const isContainer = ifrWin._.isObject(mapped) && ((ifrWin._.isBoolean(mapped.is_container) && mapped.is_container === true) || !ifrWin._.isEmpty(
      mapped.as_parent))

    const type = ifrWin._.isUndefined(ifrWin.vc.getParamSettings(tag, 'content')) && !isContainer ? 'single' : ''
    let content = ''
    if (type !== 'single') {
      content = mergedParams.content
      delete mergedParams.content
    }
    const data = {
      tag: tag,
      attrs: mergedParams,
      content: content || '',
      type: type
    }

    this.props.save(ifrWin.wp.shortcode.string(data))
  }

  render () {
    let loadingOverlay = null
    if (this.state.loadingEditor) {
      loadingOverlay = (
        <div className='vcv-loading-overlay'>
          <div className='vcv-loading-dots-container'>
            <div className='vcv-loading-dot vcv-loading-dot-1' />
            <div className='vcv-loading-dot vcv-loading-dot-2' />
          </div>
        </div>
      )
    }

    return (
      <div className='vcv-wpbakery-edit-form-modal-inner'>
        {loadingOverlay}
        <iframe ref='iframeRef' src={window.VCV_WPBAKERY_EDIT_FORM_URL()} onLoad={this.editorIframeLoaded} />
      </div>
    )
  }
}
