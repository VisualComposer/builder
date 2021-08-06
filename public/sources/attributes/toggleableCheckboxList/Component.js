import React from 'react'
import Attribute from '../attribute'
import Toggle from '../toggle/Component'
import Checkbox from '../checkbox/Component'
import debounce from 'lodash/debounce'

export default class ToggleableCheckboxList extends Attribute {
  static defaultProps = {
    fieldType: 'toggleableCheckboxList'
  }

  constructor (props) {
    super(props)
    this.onChangeToggleCheckboxList = this.onChangeToggleCheckboxList.bind(this)
    this.onChangeCheckboxList = this.onChangeCheckboxList.bind(this)
    this.requestToServer = debounce(this.requestToServer.bind(this), 100)
    this.checkboxList = React.createRef()
  }

  componentDidMount () {
    this.requestToServer()
  }

  /* eslint-disable */
  UNSAFE_componentWillReceiveProps (nextProps) {
    // Intentionally left blank
    // TODO: Possibly remove this hook in Attributes.js
  }

  /* eslint-enable */

  onChangeToggleCheckboxList (fieldKey, value) {
    const stateValue = this.state.value
    stateValue.enabled = value
    this.setFieldValue(stateValue)
  }

  onChangeCheckboxList (fieldKey, value) {
    const stateValue = this.state.value
    stateValue.values = value
    this.setFieldValue(stateValue)
  }

  requestToServer () {
    this.checkboxList?.current?.requestToServer()
  }

  /**
   * Value example
   * {
   *   'enabled': true/false
   *   'values': [1,4,44,54]
   * }
   */
  render () {
    const toggleOutput = (
      <div className='vcv-ui-form-group'>
        <Toggle
          {...this.props}
          api={this.props.api}
          key='toggleCheckboxList'
          fieldKey='toggleCheckboxList'
          updater={this.onChangeToggleCheckboxList}
          options={{ labelText: '' }}
          value={this.state.value?.enabled || false}
        />
      </div>
    )
    let checkboxOutput = null
    if (this.state.value?.enabled) {
      checkboxOutput = (
        <div className='vcv-ui-form-group'>
          <Checkbox
            {...this.props}
            key='checkboxList'
            fieldKey='checkboxList'
            fieldType='checkbox'
            ref={this.checkboxList}
            options={this.props.options}
            value={this.state.value?.values || []}
            api={this.props.api}
            updater={this.onChangeCheckboxList}
          />
        </div>
      )
    }

    return (
      <div className='vcv-ui-form-group'>
        {toggleOutput}
        {checkboxOutput}
      </div>
    )
  }
}
