import React from 'react'
import { env, getService, getStorage } from 'vc-cake'
import DynamicPopup from './dynamicPopup'

const { getBlockRegexp, parseDynamicBlock } = getService('utils')
const blockRegexp = getBlockRegexp()
const settingsStorage = getStorage('settings')

export default class DynamicAttribute extends React.Component {
  static localizations = window.VCV_I18N && window.VCV_I18N()

  constructor (props) {
    super(props)
    this.handleDynamicFieldOpen = this.handleDynamicFieldOpen.bind(this)
    this.handleDynamicFieldClose = this.handleDynamicFieldClose.bind(this)
    this.handleDynamicFieldChange = this.handleDynamicFieldChange.bind(this)
    this.onLoadPostFields = this.onLoadPostFields.bind(this)
    this.open = this.open.bind(this)
    this.hide = this.hide.bind(this)

    const isDynamic = env('VCV_JS_FT_DYNAMIC_FIELDS') && this.props.options && this.props.options.dynamicField
    let state = {
      isDynamic: isDynamic,
      dynamicFieldOpened: false,
      isWindowOpen: false,
      blockInfo: false
    }

    if (isDynamic) {
      let newState = this.getStateFromValue(this.props.value)
      state = { ...state, ...newState }
      if (state.blockInfo && state.blockInfo.blockAtts && state.blockInfo.blockAtts.sourceId) {
        window.setTimeout(() => {
          settingsStorage.trigger('loadDynamicPost', state.blockInfo.blockAtts.sourceId, this.onLoadPostFields, (error) => {
            console.warn('Error loading dynamic post info', error)
            this.onLoadPostFields(state.blockInfo.blockAtts.sourceId, {}, {})
          }, true)
        }, 1)
      }
    }

    this.state = state
  }

  onLoadPostFields (sourceId, postData, postFields) {
    this.setState({ dataLoaded: sourceId })
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
      if (newState.blockInfo && newState.blockInfo.blockAtts && newState.blockInfo.blockAtts.sourceId) {
        window.setTimeout(() => {
          settingsStorage.trigger('loadDynamicPost', newState.blockInfo.blockAtts.sourceId, this.onLoadPostFields, (error) => {
            console.warn('Error loading dynamic post info', error)
            this.onLoadPostFields(newState.blockInfo.blockAtts.sourceId, {}, {})
          }, true)
        }, 1)
      }
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

  handleDynamicFieldOpen () {
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
    let prevDynamicValue = this.state.blockInfo.value
    if (this.state.prevValue) {
      this.props.setFieldValue(this.state.prevValue)
    } else if (this.props.defaultValue !== undefined) {
      this.props.setFieldValue(this.props.defaultValue)
    }
    this.setState({
      prevDynamicValue: prevDynamicValue,
      dynamicFieldOpened: false
    })
    this.props.onClose && this.props.onClose(this)
  }

  renderOpenButton () {
    return <span className='vcv-ui-icon vcv-ui-icon-plug vcv-ui-dynamic-field-control' onClick={this.open} title={DynamicAttribute.localizations.dynamicFieldsOpenText || 'Insert dynamic content'} />
  }

  renderCloseButton () {
    return <span className='vcv-ui-icon vcv-ui-icon-close vcv-ui-dynamic-field-control' onClick={this.handleDynamicFieldClose} title={DynamicAttribute.localizations.dynamicFieldsCloseText || 'Close Dynamic Field'} />
  }

  getDynamicLabel (postField, sourceId) {
    if (!postField) {
      return null
    }

    let currentIdFields = settingsStorage.state('postFields').get()

    if (postField && postField.match(/::/)) {
      return postField.split('::')[ 1 ] // Return other value from input
    }

    if (sourceId && (window.vcvSourceID !== sourceId)) {
      if (currentIdFields.hasOwnProperty(sourceId)) {
        currentIdFields = currentIdFields[ sourceId ]
      } else {
        // Post doesn't exist or has been deleted
        return null
      }
    }

    const currentTypeFields = currentIdFields[ this.props.fieldType ]
    let fieldLabel = null

    if (currentTypeFields) {
      for (let key in currentTypeFields) {
        const item = currentTypeFields[ key ]
        let breakLoop = false

        if (item && item.group && item.group.values && item.group.values.length) {
          for (let fieldItem of item.group.values) {
            if (fieldItem.value === postField) {
              fieldLabel = fieldItem.label
              breakLoop = true
            }
          }
        }

        if (breakLoop) {
          break
        }
      }
    }

    // Data not found for some reasons
    return fieldLabel
  }

  renderDynamicInputs () {
    const { blockInfo } = this.state
    const { dynamicFieldType } = this.props
    let noValueSetText = DynamicAttribute.localizations.noValueSet || 'No value set'
    let placeholderTag = <span className='vcv-ui-dynamic-field-tag vcv-ui-dynamic-field-tag--inactive' onClick={this.open}>{noValueSetText}</span>
    let labelText = noValueSetText

    if (blockInfo && blockInfo.blockAtts) {
      const label = this.getDynamicLabel(blockInfo.blockAtts.value, blockInfo.blockAtts.sourceId)
      if (label) {
        placeholderTag = <span className='vcv-ui-dynamic-field-tag' onClick={this.open}>{label}</span>
        labelText = label
      } else {
        placeholderTag = <span className='vcv-ui-dynamic-field-tag vcv-ui-dynamic-field-tag--inactive' onClick={this.open}>{blockInfo.blockAtts.value}</span>
        labelText = blockInfo.blockAtts.value
      }
    }
    let plugIconTitle = DynamicAttribute.localizations.dynamicFieldsEditText || 'Edit dynamic content'

    if (dynamicFieldType === 'imageUrl') {
      plugIconTitle = labelText
      placeholderTag = null
    }

    return (
      <div className='vcv-ui-dynamic-field-container'>
        {placeholderTag}
        <span className='vcv-ui-dynamic-field-controls'>
          <span className='vcv-ui-icon vcv-ui-icon-plug vcv-ui-dynamic-field-control' onClick={this.open} title={plugIconTitle} />
          {this.renderCloseButton()}
        </span>
      </div>
    )
  }

  getDynamicPopup () {
    return <DynamicPopup
      save={this.handleDynamicFieldChange}
      hide={this.hide}
      open={this.handleDynamicFieldOpen}
      fieldType={this.props.fieldType}
      fieldKey={this.props.fieldKey}
      dynamicFieldOpened={this.state.dynamicFieldOpened}
      value={this.state.prevDynamicValue || this.props.value}
      elementAccessPoint={this.props.elementAccessPoint}
      renderExtraOptions={this.props.renderExtraOptions}
    />
  }

  open (e) {
    e && e.preventDefault()
    this.props.handleOpenClick && this.props.handleOpenClick()

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
    const { dynamicFieldOpened, isDynamic, isWindowOpen } = this.state
    const { children, render } = this.props

    if (!isDynamic) {
      return children || null
    }

    // In case if custom render provided
    if (render) {
      return render(this)
    }

    let content = ''
    if (dynamicFieldOpened) {
      content = this.renderDynamicInputs()
    } else {
      content = (
        <React.Fragment>
          {children}
          {this.renderOpenButton()}
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        {content}
        {isWindowOpen ? this.getDynamicPopup() : null}
      </React.Fragment>
    )
  }
}
