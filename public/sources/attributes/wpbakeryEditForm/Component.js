import React from 'react'
import Attribute from '../attribute'
import TreeViewContainer from './lib/treeViewContainer'

export default class WpbakeryEditForm extends Attribute {
  constructor (props) {
    super(props)

    this.save = this.save.bind(this)
  }

  save (newValue) {
    this.setFieldValue(newValue)
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const wpbakeryAttrDescription = localizations ? localizations.wpbakeryAttrDescription : 'WPBakery element is displayed as shortcode. Adjust shortcode parameters or open WPBakery Edit form for easier editing.'
    const { value } = this.state

    return (
      <React.Fragment>
        <textarea className='vcv-ui-form-input' value={value} onChange={this.handleChange.bind(this)} />
        <p className='vcv-ui-form-helper'>{wpbakeryAttrDescription}</p>
        <TreeViewContainer value={value} updater={this.save} />
      </React.Fragment>
    )
  }
}
