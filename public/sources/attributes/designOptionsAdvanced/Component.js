import React from 'react'
import Attribute from '../attribute'
import String from '../string/Component'
import Color from '../color/Component'

class DesignOptionsAdvanced extends Attribute {

  constructor (props) {
    super(props)

    this.dataUpdater = this.dataUpdater.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    this.setState(this.updateState(nextProps))
  }

  /**
   * Prepare data for setState
   * @param props
   * @returns {{value: *}}
   */
  updateState (props) {
    return {
      value: props.value
    }
  }

  /**
   * Handle change of input field
   * @param event
   */
  dataUpdater (fieldKey, value) {
    console.log(fieldKey, value)
    let newValue = Object.assign({}, this.state.value, { [fieldKey]: value })
    // this.setState({ value: value })
    this.setFieldValue(newValue)
  }

  /**
   * Flush field value
   * @param value
   */
  setFieldValue (value) {
    let { updater, fieldKey } = this.props
    updater(fieldKey, value)
    this.setState({ value: value })
  }

  getStringRender () {
    let { value } = this.state
    return <String
      api={this.props.api}
      fieldKey='name'
      updater={this.dataUpdater}
      value={value.name || ''} />
  }
  getColorRender () {
    let { value } = this.state
    return <Color
      api={this.props.api}
      fieldKey='color'
      updater={this.dataUpdater}
      value={value.color || ''} />
  }
  getBackgroundRender () {
    let { value } = this.state
    return <Color
      api={this.props.api}
      fieldKey='background'
      updater={this.dataUpdater}
      value={value.background || ''} />
  }

  render () {
    console.log(this.state.value)
    return (
      <div className='advanced-design-options'>
        <code>Name</code>
        {this.getStringRender()}
        <code>Color</code>
        {this.getColorRender()}
        <code>Background</code>
        {this.getBackgroundRender()}
      </div>
    )
  }
}

export default DesignOptionsAdvanced
