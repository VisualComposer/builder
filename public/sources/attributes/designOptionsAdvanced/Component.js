import React from 'react'
import Attribute from '../attribute'
import String from '../string/Component'
import Color from '../color/Component'
import Radio from '../radio/Component'
import Devices from '../devices/Component'
import BoxModel from '../boxModel/Component'

class DesignOptionsAdvanced extends Attribute {
  static attributeMixin = {
    src: require('raw-loader!./cssMixins/designeOptionsAdvanced.pcss'),
    variables: {
      elId: {
        value: ''
      },
      color: {
        namePattern: '[\\da-f]+',
        value: ''
      },
      background: {
        namePattern: '[\\da-f]+',
        value: ''
      }
    }
  }

  constructor (props) {
    super(props)
    this.state.value.attributeMixin = Object.assign({}, DesignOptionsAdvanced.attributeMixin)

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
    let newValue = Object.assign({}, this.state.value, { [fieldKey]: value })
    if (newValue.attributeMixin.variables[ fieldKey ]) {
      newValue.attributeMixin.variables[ fieldKey ].value = value
    }
    this.setFieldValue(newValue)
  }

  /**
   * Flush field value
   * @param value
   */
  setFieldValue (value) {
    let { updater, fieldKey } = this.props
    updater(fieldKey, value)
    // this.setState({ value: value })
  }

  getStringRender () {
    let { value } = this.state
    return <String
      api={this.props.api}
      fieldKey='elId'
      updater={this.dataUpdater}
      value={value.elId || ''} />
  }

  getColorRender () {
    let { value } = this.state
    return <Color
      api={this.props.api}
      fieldKey='color'
      updater={this.dataUpdater}
      value={value.color || ''}
      defaultValue='' />
  }

  getBackgroundRender () {
    let { value } = this.state
    return <Color
      api={this.props.api}
      fieldKey='background'
      updater={this.dataUpdater}
      value={value.background || ''}
      defaultValue='' />
  }

  getRadioRender () {
    let { value } = this.state
    let options = {
      values: [
        {
          label: 'All',
          value: 'all'
        },
        {
          label: 'Custom',
          value: 'custom'
        }
      ]
    }
    return <Radio
      api={this.props.api}
      fieldKey='radio'
      options={options}
      updater={this.dataUpdater}
      value={value.radio || 'all'} />
  }

  getDevicesRender () {
    let { value } = this.state
    return <Devices
      api={this.props.api}
      fieldKey='device'
      updater={this.dataUpdater}
      value={value.device || 'all'} />
  }

  getBoxModelRender () {
    let { value } = this.state
    return <BoxModel
      api={this.props.api}
      fieldKey='boxModel'
      updater={this.dataUpdater}
      value={value.boxModel || {}} />
  }

  render () {
    return (
      <div className='advanced-design-options'>
        <code>box model</code>
        {this.getBoxModelRender()}
        <code>devices</code>
        {this.getDevicesRender()}
        <code>id</code>
        {this.getStringRender()}
        <code>Color</code>
        {this.getColorRender()}
        <code>Background</code>
        {this.getBackgroundRender()}
        <code>Radio</code>
        {this.getRadioRender()}
      </div>
    )
  }
}

export default DesignOptionsAdvanced
