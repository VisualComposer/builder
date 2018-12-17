import React from 'react'
import Attribute from '../attribute'
import TreeViewContainer from './lib/treeViewContainer'
import Toggle from '../toggle/Component'

export default class WpbakeryEditForm extends Attribute {
  constructor (props) {
    super(props)
    this.handleToggleTextarea = this.handleToggleTextarea.bind(this)
  }

  updateState (props) {
    return {
      value: props.value,
      toggleTextarea: false
    }
  }

  handleToggleTextarea () {
    this.setState({ toggleTextarea: !this.state.toggleTextarea })
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const wpbakeryAttrDescription = localizations ? localizations.wpbakeryAttrDescription : 'WPBakery element is displayed as shortcode. Adjust shortcode parameters or open WPBakery Edit form for easier editing.'
    const TextArea = this.state.toggleTextarea
      ? <div>
        <textarea className='vcv-ui-form-input' value={this.state.value} onChange={this.handleChange} />
        <p className='vcv-ui-form-helper'>{wpbakeryAttrDescription}</p>
      </div>
      : null

    return (
      <React.Fragment>
        <TreeViewContainer value={this.state.value} updater={this.setFieldValue} />
        {TextArea}
        <Toggle value={this.state.toggleTextarea} fieldKey='toggleTextarea' updater={this.handleToggleTextarea} />
      </React.Fragment>
    )
  }
}
