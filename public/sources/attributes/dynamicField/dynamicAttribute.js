import React from 'react'
import { env, getService, getStorage } from 'vc-cake'
import DynamicPopup from './dynamicPopup'
import classNames from 'classnames'
import store from 'public/editor/stores/store'
import { fullScreenPopupDataSet, activeFullPopupSet } from 'public/editor/stores/editorPopup/slice'

const { getBlockRegexp, parseDynamicBlock } = getService('utils')
const blockRegexp = getBlockRegexp()
const settingsStorage = getStorage('settings')
const dataManager = getService('dataManager')

export default class DynamicAttribute extends React.Component {
  static localizations = dataManager.get('localizations')

  constructor (props) {
    super(props)
    this.handleDynamicFieldOpen = this.handleDynamicFieldOpen.bind(this)
    this.handleDynamicFieldClose = this.handleDynamicFieldClose.bind(this)
    this.handleDynamicFieldChange = this.handleDynamicFieldChange.bind(this)
    this.onLoadPostFields = this.onLoadPostFields.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleHide = this.handleHide.bind(this)
    const isInnerMultipleLevel = props && props.elementAccessPoint && props.elementAccessPoint.innerMultipleLevel
    // Disable dynamic content for multiple element nesting element > innerElement > innerElement (dynamic disabled for 3rd level)
    const isDynamic = isInnerMultipleLevel ? false : this.props.options && this.props.options.dynamicField
    let state = {
      isDynamic: isDynamic,
      dynamicFieldOpened: false,
      isWindowOpen: false,
      blockInfo: false
    }

    if (isDynamic) {
      const newState = this.getStateFromValue(this.props.value)
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

  onLoadPostFields (sourceId) {
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
      const newState = this.getStateFromValue(newValue)
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
    const state = {
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
    const newValue = this.props.onDynamicFieldChange(dynamicFieldKey, sourceId, showAutocomplete)
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
    const prevDynamicValue = this.state.blockInfo.value
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

  renderOpenButton (icon = false) {
    const classes = classNames({
      'vcv-ui-icon': true,
      'vcv-ui-icon-plug': !icon,
      'vcv-ui-icon-plug-modern': icon,
      'vcv-ui-dynamic-field-control': true,
      'vcv-ui-dynamic-field-control--inactive': !env('VCV_JS_FT_DYNAMIC_FIELDS')
    })

    return <span className={classes} onClick={this.handleOpen} title={DynamicAttribute.localizations.dynamicFieldsOpenText || 'Insert dynamic content'} />
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
      return postField.split('::')[1] // Return other value from input
    }

    if (sourceId && (dataManager.get('sourceID') !== sourceId)) {
      if (Object.prototype.hasOwnProperty.call(currentIdFields, sourceId)) {
        currentIdFields = currentIdFields[sourceId]
      } else {
        // Post doesn't exist or has been deleted
        return null
      }
    }

    const currentTypeFields = currentIdFields[this.props.fieldType]
    let fieldLabel = null

    if (currentTypeFields) {
      for (const key in currentTypeFields) {
        const item = currentTypeFields[key]
        let breakLoop = false

        if (item && item.group && item.group.values && item.group.values.length) {
          for (const fieldItem of item.group.values) {
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

  renderDynamicInputs (urlHtml) {
    const { blockInfo } = this.state
    const { dynamicFieldType } = this.props
    const noValueSetText = DynamicAttribute.localizations.noValueSet || 'No value set'
    let placeholderTag =
      <span className='vcv-ui-dynamic-field-tag vcv-ui-dynamic-field-tag--inactive' onClick={this.handleOpen}>{noValueSetText}</span>
    let labelText = noValueSetText

    if (blockInfo && blockInfo.blockAtts) {
      const label = this.getDynamicLabel(blockInfo.blockAtts.value, blockInfo.blockAtts.sourceId)
      if (label) {
        placeholderTag = <span className='vcv-ui-dynamic-field-tag' onClick={this.handleOpen}>{label}</span>
        labelText = label
      } else {
        const placeholderClass = this.props.onlyDynamicCustomFields ? 'vcv-ui-dynamic-field-tag--placeholder' : 'vcv-ui-dynamic-field-tag--inactive'
        const className = 'vcv-ui-dynamic-field-tag ' + placeholderClass

        placeholderTag =
          <span className={className} onClick={this.handleOpen}>{blockInfo.blockAtts.value}</span>
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
          <span className='vcv-ui-icon vcv-ui-icon-plug vcv-ui-dynamic-field-control' onClick={this.handleOpen} title={plugIconTitle} />
          {urlHtml || null}
          {this.props.onlyDynamicCustomFields ? null : this.renderCloseButton()}
        </span>
      </div>
    )
  }

  getDynamicPopup () {
    return (
      <DynamicPopup
        onSave={this.handleDynamicFieldChange}
        onHide={this.handleHide}
        onOpen={this.handleDynamicFieldOpen}
        fieldType={this.props.fieldType}
        fieldKey={this.props.fieldKey}
        dynamicFieldOpened={this.state.dynamicFieldOpened}
        value={this.state.prevDynamicValue || this.props.value}
        elementAccessPoint={this.props.elementAccessPoint}
        renderExtraOptions={this.props.renderExtraOptions}
        onlyDynamicCustomFields={this.props.onlyDynamicCustomFields}
      />
    )
  }

  handleOpen (e) {
    e && e.preventDefault()

    if (env('VCV_JS_FT_DYNAMIC_FIELDS')) {
      this.props.onOpenClick && this.props.onOpenClick()
      this.setState({
        isWindowOpen: true
      })
    } else {
      const popupData = {
        isPremiumActivated: dataManager.get('isPremiumActivated'),
        headingText: DynamicAttribute.localizations ? DynamicAttribute.localizations.dynamicContentIsAPremiumFeature : 'Dynamic Content is a Premium Feature'
      }

      if (dataManager.get('isPremiumActivated')) {
        popupData.buttonText = DynamicAttribute.localizations ? DynamicAttribute.localizations.downloadAddonText : 'Download Addon'
        popupData.description = DynamicAttribute.localizations ? DynamicAttribute.localizations.replaceStaticContentWithPremiumAddon : 'Replace static content with dynamic content from WordPress default and custom meta fields with Visual Composer Premium Addon.'
        popupData.addonName = 'dynamicFields'
        popupData.clickSettings = {
          action: 'addHub',
          options: {
            filterType: 'addon',
            id: 3,
            bundleType: undefined
          }
        }
      } else {
        const utm = dataManager.get('utm')
        const utmLink = utm['editor-hub-popup-teaser']
        popupData.url = utmLink.replace('{medium}', 'dynamiccontent-editform-editor')
        popupData.buttonText = DynamicAttribute.localizations ? DynamicAttribute.localizations.goPremium : 'Go Premium'
        popupData.description = DynamicAttribute.localizations ? DynamicAttribute.localizations.replaceStaticContentWithPremium : 'Replace static content with dynamic content from WordPress default and custom meta fields with Visual Composer Premium.'
      }

      store.dispatch(fullScreenPopupDataSet(popupData))
      store.dispatch(activeFullPopupSet('premium-teaser'))
    }
  }

  handleHide () {
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
        <>
          {children}
          {this.renderOpenButton()}
        </>
      )
    }

    return (
      <>
        {content}
        {isWindowOpen ? this.getDynamicPopup() : null}
      </>
    )
  }
}
