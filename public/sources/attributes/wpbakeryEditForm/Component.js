import React from 'react'
import Attribute from '../attribute'
import TreeViewContainer from './lib/treeViewContainer'
import Toggle from '../toggle/Component'
import WpbakeryModal from './lib/wpbakeryModal'
import WpbakeryIframe from './lib/wpbakeryIframe'

export default class WpbakeryEditForm extends Attribute {
  constructor (props) {
    super(props)
    this.localizations = window.VCV_I18N && window.VCV_I18N()
    this.handleToggleTextarea = this.handleToggleTextarea.bind(this)
    this.showEditor = this.showEditor.bind(this)
    this.close = this.close.bind(this)
    this.save = this.save.bind(this)
  }

  updateState (props) {
    return {
      value: props.value,
      toggleTextarea: false,
      showRootEditor: false
    }
  }

  showEditor (e) {
    e && e.preventDefault && e.preventDefault()
    this.setState({ showRootEditor: true })
  }

  close () {
    this.setState({
      showRootEditor: false
    })
  }

  save (newValue) {
    this.setFieldValue(newValue)
    this.close()
  }

  handleToggleTextarea () {
    this.setState({ toggleTextarea: !this.state.toggleTextarea })
  }

  getEditContent (isWpbAvailable, value, openEditForm) {
    let content = null

    if (isWpbAvailable) {
      const multipleShortcodesRegex = window.wp.shortcode.regexp(window.VCV_API_WPBAKERY_WPB_MAP().join('|'))
      const localShortcodesRegex = new RegExp(multipleShortcodesRegex.source)
      const rootData = value.match(localShortcodesRegex)
      if (rootData) {
        const mapped = window.VCV_API_WPBAKERY_WPB_MAP_FULL()[ rootData[ 2 ] ]
        const isContainer = mapped && (mapped.is_container === true || mapped.as_parent)
        if (isContainer) {
          const wpbakeryTreeViewAttrDescription = this.localizations ? this.localizations.wpbakeryTreeViewAttrDescription : 'Complex element structures (ex. tabs with content) are represented with the Tree view. Use the Tree view to access and edit individual elements.'
          const wpbakeryStructureTitle = this.localizations ? this.localizations.wpbakeryStructureTitle : 'WPBakery element structure'
          content = <React.Fragment>
            <span className='vcv-ui-form-group-heading'>{wpbakeryStructureTitle}</span>
            <p className='vcv-ui-form-helper'>{wpbakeryTreeViewAttrDescription}</p>
            <TreeViewContainer value={value} updater={this.setFieldValue} />
          </React.Fragment>
        } else {
          const wpbakeryModal = this.state.showRootEditor ? <WpbakeryModal>
            <WpbakeryIframe close={this.close} save={this.save} value={value} />
          </WpbakeryModal> : null
          content = (
            <React.Fragment>
              {wpbakeryModal}
              <div className='vcv-ui-form-group'>
                <button
                  className='vcv-ui-form-button vcv-ui-form-button--action'
                  onClick={this.showEditor}
                  value={value}>{openEditForm}
                </button>
              </div>
            </React.Fragment>
          )
        }
      }
    }

    return content
  }

  render () {
    const wpbakeryAttrDescription = this.localizations ? this.localizations.wpbakeryAttrDescription : 'WPBakery element is displayed as shortcode. Adjust shortcode parameters or open WPBakery Edit form for easier editing.'
    const openEditForm = this.localizations ? this.localizations.openEditForm : 'Open Edit Form'
    const wpbakeryToggleDescription = this.localizations ? this.localizations.wpbakeryAttrToggleDescription : 'View WPBakery element/s as shortcodes'
    const TextArea = this.state.toggleTextarea
      ? <div>
        <textarea className='vcv-ui-form-input' value={this.state.value} onChange={this.handleChange} />
        <p className='vcv-ui-form-helper'>{wpbakeryAttrDescription}</p>
      </div>
      : null

    const value = this.state.value
    const isWpbAvailable = window.wp && window.wp.shortcode && window.VCV_API_WPBAKERY_WPB_MAP && window.VCV_API_WPBAKERY_WPB_MAP_FULL
    let content = this.getEditContent(isWpbAvailable, value, openEditForm)

    return (
      <React.Fragment>
        {content}
        <div className='vcv-ui-form-group'>
          <Toggle value={this.state.toggleTextarea} fieldKey='toggleTextarea' updater={this.handleToggleTextarea} />
          <span className='vcv-ui-form-group-heading vcv-ui-form-group-heading--inline'>{wpbakeryToggleDescription}</span>
        </div>
        {TextArea}
      </React.Fragment>
    )
  }
}
