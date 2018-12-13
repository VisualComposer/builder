import React from 'react'
import Attribute from '../attribute'
import lodash from 'lodash'
import WpbakeryModal from './lib/wpbakeryModal'
import WpbakeryIframe from './lib/wpbakeryIframe'
import TreeViewContainer from './lib/treeViewContainer'

export default class WpbakeryEditForm extends Attribute {
  static defaultState = {
    showEditor: false
  }

  constructor (props) {
    super(props)

    this.showEditor = this.showEditor.bind(this)
    this.close = this.close.bind(this)
    this.save = this.save.bind(this)
  }

  updateState (props) {
    let newState = lodash.defaultsDeep({}, props, WpbakeryEditForm.defaultState)

    return newState
  }

  showEditor (e) {
    e && e.preventDefault && e.preventDefault()
    this.setState({ showEditor: true })
  }

  close () {
    this.setState({
      showEditor: false
    })
  }

  save (newValue) {
    this.setFieldValue(newValue)
    this.close()
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const openEditForm = localizations ? localizations.openEditForm : 'Open Edit Form'
    const wpbakeryAttrDescription = localizations ? localizations.wpbakeryAttrDescription : 'WPBakery element is displayed as shortcode. Adjust shortcode parameters or open WPBakery Edit form for easier editing.'
    const { value } = this.state

    return (
      <React.Fragment>
        <textarea className='vcv-ui-form-input' value={value} onChange={this.handleChange.bind(this)} />
        {this.state.showEditor ? <WpbakeryModal>
          <WpbakeryIframe close={this.close} save={this.save} value={value} />
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
