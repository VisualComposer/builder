import React from 'react'
import { env, getService } from 'vc-cake'
import DynamicPopup from './dynamicPopup'

const { getBlockRegexp, parseDynamicBlock } = getService('utils')
const blockRegexp = getBlockRegexp()

export default class DynamicAttribute extends React.Component {
  static localizations = window.VCV_I18N && window.VCV_I18N()

  constructor (props) {
    super(props)
    this.handleDynamicFieldOpen = this.handleDynamicFieldOpen.bind(this)
    this.handleDynamicFieldClose = this.handleDynamicFieldClose.bind(this)
    this.handleDynamicFieldChange = this.handleDynamicFieldChange.bind(this)
    this.open = this.open.bind(this)
    this.hide = this.hide.bind(this)

    const isDynamic = env('VCV_JS_FT_DYNAMIC_FIELDS') && this.props.options && this.props.options.dynamicField && !(this.props.editFormOptions && this.props.editFormOptions.nestedAttr)
    let state = {
      isDynamic: isDynamic,
      dynamicFieldOpened: false,
      isWindowOpen: false,
      blockInfo: false
    }

    if (isDynamic) {
      let newState = this.getStateFromValue(this.props.value)
      state = { ...state, ...newState }
    }
    this.state = state
  }

  componentDidUpdate (prevProps, prevState) {
    if (!this.state.isDynamic) {
      return
    }
    if (prevState.dynamicFieldOpened !== this.state.dynamicFieldOpened) {
      return
    }
    // If value is changed from outside (ex. Design Options Custom Devices)
    let newValue = this.props.value
    let oldValue = prevProps.value

    if (newValue && typeof newValue === 'string' && newValue.match(blockRegexp)) {
      const blockInfo = parseDynamicBlock(newValue)
      if (blockInfo) {
        newValue = newValue.replace(blockInfo.beforeBlock, '').replace(blockInfo.afterBlock, '')
      }
    }
    if (oldValue && typeof oldValue === 'string' && oldValue.match(blockRegexp)) {
      const blockInfo = parseDynamicBlock(oldValue)
      if (blockInfo) {
        oldValue = oldValue.replace(blockInfo.beforeBlock, '').replace(blockInfo.afterBlock, '')
      }
    }

    if (oldValue !== newValue) {
      let newState = this.getStateFromValue(newValue)
      this.setState(newState)
    }
  }

  getStateFromValue (value) {
    let state = {
      dynamicFieldOpened: false
    }
    if (typeof value === 'string' && value.match(blockRegexp)) {
      const blockInfo = parseDynamicBlock(value)
      if (blockInfo && blockInfo.blockAtts) {
        state.blockInfo = blockInfo
        state.dynamicFieldOpened = true
      }
    }
    return state
  }

  handleDynamicFieldChange (dynamicFieldKey, sourceId, showAutocomplete) {
    let newValue = this.props.handleDynamicFieldChange(dynamicFieldKey, sourceId, showAutocomplete)
    let fieldValue = newValue
    let dynamicValue = newValue

    if (newValue.fieldValue && newValue.dynamicValue) {
      fieldValue = newValue.fieldValue
      dynamicValue = newValue.dynamicValue
    }

    const blockInfo = parseDynamicBlock(dynamicValue)

    this.setState({
      blockInfo: blockInfo
    })
    this.props.setFieldValue(fieldValue)
  }

  handleDynamicFieldOpen (e) {
    e && e.preventDefault()
    this.setState({
      dynamicFieldOpened: true,
      prevValue: this.props.value
    })
    if (this.state.blockInfo && this.state.blockInfo.value) {
      this.props.setFieldValue(this.state.blockInfo.value)
    }
    this.props.onOpen && this.props.onOpen(this)
  }

  handleDynamicFieldClose (e) {
    e && e.preventDefault()
    if (this.state.prevValue) {
      this.props.setFieldValue(this.state.prevValue)
    } else if (this.props.defaultValue !== undefined) {
      this.props.setFieldValue(this.props.defaultValue)
    }
    this.setState({ dynamicFieldOpened: false })
    this.props.onClose && this.props.onClose(this)
  }

  renderOpenButton () {
    return <span className='vcv-ui-icon vcv-ui-icon-plug vcv-ui-dynamic-field-control' onClick={this.handleDynamicFieldOpen} title={DynamicAttribute.localizations.dynamicFieldsOpenText || 'Insert dynamic content'} />
  }

  renderCloseButton () {
    return <span className='vcv-ui-icon vcv-ui-icon-close vcv-ui-dynamic-field-control' onClick={this.handleDynamicFieldClose} title={DynamicAttribute.localizations.dynamicFieldsCloseText || 'Close Dynamic Field'} />
  }

  renderDynamicInputs () {
    const { blockInfo } = this.state
    let placeholderTag = <span className='vcv-ui-dynamic-field-tag vcv-ui-dynamic-field-tag--inactive'>No value set</span>

    if (blockInfo && blockInfo.blockAtts) {
      placeholderTag = <span className='vcv-ui-dynamic-field-tag'>{blockInfo.blockAtts.value}</span>
    }

    return (
      <div className='vcv-ui-dynamic-field-container'>
        {placeholderTag}
        <span className='vcv-ui-dynamic-field-controls'>
          <span className='vcv-ui-icon vcv-ui-icon-plug vcv-ui-dynamic-field-control' onClick={this.open} title={DynamicAttribute.localizations.dynamicFieldsEditText || 'Edit dynamic content'} />
          {this.renderCloseButton()}
        </span>
        {this.state.isWindowOpen ? this.getDynamicPopup() : null}
      </div>
    )
  }

  getDynamicPopup () {
    return <DynamicPopup
      save={this.handleDynamicFieldChange}
      hide={this.hide}
      fieldType={this.props.fieldType}
      value={this.props.value}
      elementAccessPoint={this.props.elementAccessPoint}
    />
  }

  open (e) {
    e && e.preventDefault()

    this.setState({
      isWindowOpen: true
    })
  }

  hide () {
    this.setState({
      isWindowOpen: false
    })
  }

  render () {
    if (!this.state.isDynamic) {
      return this.props.children || null
    }
    if (this.props.editFormOptions && this.props.editFormOptions.nestedAttr) {
      // We are inside paramsGroup, it is not implemented yet.
      return this.props.children || null
    }

    // In case if custom render provided
    if (this.props.render) {
      return this.props.render(this)
    }

    const { dynamicFieldOpened } = this.state
    if (dynamicFieldOpened) {
      return this.renderDynamicInputs()
    }

    return (
      <React.Fragment>
        {this.props.children}
        {this.renderOpenButton()}
      </React.Fragment>
    )
  }
}
