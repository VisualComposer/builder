import React from 'react'
import PropTypes from 'prop-types'

export default class wpbakeryIframe extends React.Component {
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
    const data = {
      tag: tag,
      attrs: mergedParams,
      content: mergedParams.content || '',
      type: ifrWin._.isUndefined(ifrWin.vc.getParamSettings(tag, 'content')) && !isContainer ? 'single' : ''
    }
    this.props.save(ifrWin.wp.shortcode.string(data))
  }

  editorIframeLoaded () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const wpbakeryAttrError = localizations ? localizations.wpbakeryAttrError : 'Failed to load WPBakery Edit Form, please check WPBakery Page Builder Plugin.'
    const ifrWin = this.refs.iframeRef.contentWindow
    if (!ifrWin.vc) {
      window.alert(wpbakeryAttrError)
      this.props.close()
    }
    let preModel = ifrWin.vc.storage.parseContent([], this.state.value)
    // eslint-disable-next-line new-cap
    let model = new ifrWin.vc.shortcode(preModel[ 0 ])
    ifrWin.vc.edit_element_block_view.on('afterRender', () => {
      let $saveBtn = ifrWin.vc.edit_element_block_view.$el.find('[data-vc-ui-element="button-save"]').hide()
      let $newSaveBtn = ifrWin.jQuery(`<span class="vc_general vc_ui-button vc_ui-button-action vc_ui-button-shape-rounded vc_ui-button-fw" data-vc-ui-element="button-save-custom"></span>`)
      $newSaveBtn.text($saveBtn.text())
      $newSaveBtn.insertAfter($saveBtn)
      $newSaveBtn.click(this.handleSaveClick)
      this.setState({
        loadingEditor: false
      })
    })
    ifrWin.vc.edit_element_block_view.on('save', this.handleSaveClick)
    ifrWin.vc.edit_element_block_view.on('hide', this.props.close)
    ifrWin.vc.edit_element_block_view.render(model)
  }

  render () {
    const { loadingEditor } = this.state
    let loadingOverlay = null
    if (loadingEditor) {
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
