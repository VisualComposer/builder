import React from 'react'
import Attribute from '../attribute'
import lodash from 'lodash'
import WpbakeryModal from './lib/wpbakeryModal'
import TreeViewContainer from './lib/treeViewContainer'

export default class WpbakeryEditForm extends Attribute {
  static defaultState = {
    showEditor: false,
    loadingEditor: false
  }

  constructor (props) {
    super(props)

    this.showEditor = this.showEditor.bind(this)
  }

  updateState (props) {
    let newState = lodash.defaultsDeep({}, props, WpbakeryEditForm.defaultState)

    return newState
  }

  showEditor (e) {
    e && e.preventDefault && e.preventDefault()
    this.setState({ showEditor: true, loadingEditor: true })
  }

  editorIframeLoaded (e) {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const wpbakeryAttrError = localizations ? localizations.wpbakeryAttrError : 'Failed to load WPBakery Edit Form, please check WPBakery Page Builder Plugin.'
    const ifrWin = this.refs.iframeRef.contentWindow
    if (!ifrWin.vc) {
      window.alert(wpbakeryAttrError)
      this.close()
    }
    let preModel = ifrWin.vc.storage.parseContent([], this.state.value)
    // eslint-disable-next-line new-cap
    let model = new ifrWin.vc.shortcode(preModel[ 0 ])
    ifrWin.vc.edit_element_block_view.on('afterRender', () => {
      let $saveBtn = ifrWin.vc.edit_element_block_view.$el.find('[data-vc-ui-element="button-save"]').hide()
      let $newSaveBtn = ifrWin.jQuery(`<span class="vc_general vc_ui-button vc_ui-button-action vc_ui-button-shape-rounded vc_ui-button-fw" data-vc-ui-element="button-save-custom"></span>`)
      $newSaveBtn.text($saveBtn.text())
      $newSaveBtn.insertAfter($saveBtn)
      $newSaveBtn.click(this.save.bind(this))
      this.setState({
        loadingEditor: false
      })
    })
    ifrWin.vc.edit_element_block_view.on('save', this.save.bind(this))
    ifrWin.vc.edit_element_block_view.on('hide', this.close.bind(this))
    ifrWin.vc.edit_element_block_view.render(model)
  }

  close () {
    this.setState({
      showEditor: false
    })
  }

  save () {
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

    this.setFieldValue(ifrWin.wp.shortcode.string(data))
    this.close()
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const openEditForm = localizations ? localizations.openEditForm : 'Open Edit Form'
    const wpbakeryAttrDescription = localizations ? localizations.wpbakeryAttrDescription : 'WPBakery element is displayed as shortcode. Adjust shortcode parameters or open WPBakery Edit form for easier editing.'
    const { value, loadingEditor } = this.state

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
      <React.Fragment>
        <textarea className='vcv-ui-form-input' value={value} onChange={this.handleChange.bind(this)} />
        {this.state.showEditor ? <WpbakeryModal>
          <div className='vcv-wpbakery-edit-form-modal-inner'>
            {loadingOverlay}
            <iframe ref='iframeRef' src={window.VCV_WPBAKERY_EDIT_FORM_URL()} onLoad={this.editorIframeLoaded.bind(this)} />
          </div>
        </WpbakeryModal> : null}
        <p className='vcv-ui-form-helper'>{wpbakeryAttrDescription}</p>
        <button
          className='vcv-ui-form-button vcv-ui-form-button--default'
          onClick={this.showEditor}
          value={value}>{openEditForm}
        </button>
        <TreeViewContainer value={value} />
      </React.Fragment>
    )
  }
}
