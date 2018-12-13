import React from 'react'
import Attribute from '../attribute'
import TreeViewContainer from './lib/treeViewContainer'

export default class WpbakeryEditForm extends Attribute {
  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const wpbakeryAttrDescription = localizations ? localizations.wpbakeryAttrDescription : 'WPBakery element is displayed as shortcode. Adjust shortcode parameters or open WPBakery Edit form for easier editing.'

    return (
      <React.Fragment>
        <textarea className='vcv-ui-form-input' value={this.state.value} onChange={this.handleChange} />
        <p className='vcv-ui-form-helper'>{wpbakeryAttrDescription}</p>
        <TreeViewContainer value={this.state.value} updater={this.setFieldValue} />
      </React.Fragment>
    )
  }
}
