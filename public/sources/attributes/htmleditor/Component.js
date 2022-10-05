import React from 'react'
import HtmlEditor from './htmleditor'
import { createRoot } from 'react-dom/client'
import Attribute from '../attribute'
import DynamicAttribute from '../dynamicField/dynamicAttribute'
import classNames from 'classnames'
import { getService, getStorage } from 'vc-cake'
import { Provider } from 'react-redux'
import StockMediaTab from '../attachimage/stockMediaTab'
import GiphyMediaTab from '../attachimage/giphyMediaTab'
import Toggle from '../toggle/Component'
import Tooltip from 'public/components/tooltip/tooltip'
import store from 'public/editor/stores/store'
import { portalChanged } from 'public/editor/stores/notifications/slice'

const { getBlockRegexp, parseDynamicBlock } = getService('utils')
const roleManager = getService('roleManager')
const settingsStorage = getStorage('settings')
const blockRegexp = getBlockRegexp()
const exceptionalFieldTypes = ['wysiwyg', 'textarea']
const dataManager = getService('dataManager')

export default class HtmlEditorWrapper extends Attribute {
  static defaultProps = {
    fieldType: 'htmleditor'
  }

  constructor (props) {
    super(props)
    this.giphyRoot = null
    this.stockImageRoot = null
    this.handleDynamicFieldOpen = this.handleDynamicFieldOpen.bind(this)
    this.handleDynamicFieldClose = this.handleDynamicFieldClose.bind(this)
    this.handleDynamicFieldChange = this.handleDynamicFieldChange.bind(this)
    this.setValueState = this.setValueState.bind(this)
    this.setEditorLoaded = this.setEditorLoaded.bind(this)
    this.handleBodyClick = this.handleBodyClick.bind(this)
    this.onToggleChange = this.onToggleChange.bind(this)

    const isDynamic = props.options && props.options.dynamicField
    const isDynamicSet = isDynamic && typeof this.state.value === 'string' && this.state.value.match(blockRegexp)
    this.state.dynamicFieldOpened = isDynamicSet
    this.state.isDynamicSet = isDynamicSet

    if (props.options && props.options.extraToggle) {
      const blockInfo = parseDynamicBlock(this.state.value)
      if (blockInfo && blockInfo.blockAtts) {
        this.state.dynamicExtraToggleValue = props.options.extraToggle.trueValue === blockInfo.blockAtts.value
      }
    }

    if (isDynamicSet) {
      this.state.exceptionField = this.getExceptionField(this.state.value, this.props.fieldType)
    }
  }

  componentDidMount () {
    // Create the media uploader.
    if (typeof window.wp === 'undefined') {
      return false
    }

    document.body.addEventListener('click', this.handleBodyClick)
    const oldMediaFrameSelect = window.wp.media.view.MediaFrame.Post
    window.wp.media.view.MediaFrame.Post = oldMediaFrameSelect.extend({
      /**
       * Bind region mode event callbacks.
       * Add stock image tab event listeners
       * @see media.controller.Region.render
       */
      bindHandlers: function () {
        oldMediaFrameSelect.prototype.bindHandlers.apply(this, arguments)
        this.off('content:render:unsplash', this.stockImagesContent, this)
        this.on('content:render:unsplash', this.stockImagesContent, this)
        this.off('content:render:giphy', this.giphyContent, this)
        this.on('content:render:giphy', this.giphyContent, this)
      },
      /**
       * Show stock Images tab content
       */
      stockImagesContent: function () {
        this.content.set(new CustomStockImagesView({
          controller: this
        }))
      },
      /**
       * Show Giphy tab content
       */
      giphyContent: function () {
        this.content.set(new CustomGiphyView({
          controller: this
        }))
      },
      /**
       * Create tabs in Media Library
       * Clear existing, and re-render based on conditions
       * @param routerView
       */
      browseRouter: function (routerView) {
        oldMediaFrameSelect.prototype.browseRouter.apply(this, arguments)
        if (roleManager.can('hub_unsplash', roleManager.defaultTrue())) {
          routerView.set('unsplash', {
            text: 'Stock Images',
            priority: 60
          })
        }
        if (roleManager.can('hub_giphy', roleManager.defaultTrue())) {
          routerView.set('giphy', {
            text: 'Giphy',
            priority: 70
          })
        }
      }
    })

    /* eslint-disable */
    const _this = this
    /* eslint-enable */
    const CustomStockImagesView = window.wp.media.View.extend({
      remove: function () {
        _this.stockImageRoot && _this.stockImageRoot.unmount()
        _this.stockImageRoot = null
        return this
      },
      /**
       * Stock images tab content render
       * @returns {CustomStockImagesView}
       */
      render: function () {
        if (!_this.stockImageRoot) {
          _this.stockImageRoot = createRoot(this.$el.get(0))
        }
        _this.stockImageRoot.render(<Provider store={store}><StockMediaTab /></Provider>)
        return this
      }
    })
    const CustomGiphyView = window.wp.media.View.extend({
      remove: function () {
        _this.giphyRoot && _this.giphyRoot.unmount()
        _this.giphyRoot = null
        return this
      },
      /**
       * Giphy tab content render
       * @returns {CustomGiphyView}
       */
      render: function () {
        if (!_this.giphyRoot) {
          _this.giphyRoot = createRoot(this.$el.get(0))
        }
        _this.giphyRoot.render(<Provider store={store}><GiphyMediaTab /></Provider>)
        return this
      }
    })

    // Set default tab to be Upload Files in Add images modal
    window.wp.media.controller.Library.prototype.defaults.contentUserSetting = false
  }

  componentWillUnmount () {
    document.body.removeEventListener('click', this.handleBodyClick)
  }

  handleBodyClick (e) {
    if (e.target.classList.contains('insert-media')) {
      store.dispatch(portalChanged('.media-frame'))
    } else if (e.target.classList.contains('media-modal-icon') || e.target.classList.contains('media-button-insert')) {
      store.dispatch(portalChanged(null))
    }
  }

  handleDynamicFieldClose () {
    window.setTimeout(() => {
      this.setState({
        dynamicFieldOpened: false,
        isDynamicSet: false,
        exceptionField: false
      })
    }, 1)
  }

  handleDynamicFieldOpen (dynamicComponent) {
    this.setState({
      dynamicFieldOpened: true
    })
    if (dynamicComponent && dynamicComponent.state && dynamicComponent.state.blockInfo && dynamicComponent.state.blockInfo.value) {
      this.setState({
        isDynamicSet: true
      })
    }
  }

  handleDynamicFieldChange (dynamicFieldKey, sourceId, forceSaveSourceId = false) {
    // New html dynamic comment
    let value = this.props.onDynamicFieldChange(dynamicFieldKey, sourceId, forceSaveSourceId)
    const exceptionField = this.getExceptionField(value, this.props.fieldType)

    // Current value needed for .before/.after get, must be not encoded
    const dynamicValue = this.state.value
    const blockInfo = parseDynamicBlock(dynamicValue)

    if (blockInfo) {
      const before = blockInfo.beforeBlock || '<p>'
      const after = blockInfo.afterBlock || '</p>'
      value = before + value + after
    } else {
      value = `<p>${value}</p>`
    }

    this.setState({
      isDynamicSet: true,
      exceptionField: exceptionField
    })

    return value
  }

  setValueState (value) {
    this.setState({ value: value })
  }

  setEditorLoaded (loadedState) {
    this.setState({ editorLoaded: loadedState })
  }

  getExceptionField (value, fieldType) {
    let isExceptionField = false
    const blockInfo = value && value.split(blockRegexp)
    if (blockInfo.length > 1) {
      const blockAtts = JSON.parse(blockInfo[4].trim())
      const fieldValue = blockAtts.value
      const isVendorValue = fieldValue.includes(':') && fieldValue.split(':')
      const postFields = settingsStorage.state('postFields').get()
      if (isVendorValue && postFields && postFields[fieldType]) {
        const vendorName = isVendorValue[0]
        const vendorGroup = postFields[fieldType][vendorName]
        if (vendorGroup && vendorGroup.group && vendorGroup.group.values) {
          const vendorValues = vendorGroup.group.values
          const currentValue = vendorValues.find(item => item.value === fieldValue)
          isExceptionField = currentValue && currentValue.fieldType && exceptionalFieldTypes.includes(currentValue.fieldType)
        }
      }
    }
    return isExceptionField
  }

  onToggleChange (fieldKey, value) {
    const { extraToggle } = this.props.options
    this.setState({
      dynamicExtraToggleValue: value
    })
    const changeValue = value ? extraToggle.trueValue : extraToggle.falseValue
    let newDynamicValue = this.props.onDynamicFieldChange(changeValue, dataManager.get('sourceID'))

    const blockInfo = parseDynamicBlock(this.state.value)

    if (blockInfo) {
      const before = blockInfo.beforeBlock || '<p>'
      const after = blockInfo.afterBlock || '</p>'
      newDynamicValue = before + newDynamicValue + after
    } else {
      newDynamicValue = `<p>${newDynamicValue}</p>`
    }

    this.setFieldValue(newDynamicValue)
  }

  getExtraToggle () {
    const { options } = this.props
    if (options && options.extraToggle) {
      let tooltip = null
      if (options.extraToggle.description) {
        tooltip = (
          <Tooltip>
            {options.extraToggle.description}
          </Tooltip>
        )
      }

      return (
        <div className='vcv-ui-form-group'>
          <div className='vcv-ui-form-group-heading-wrapper'>
            <span className='vcv-ui-form-group-heading'>{options.extraToggle.title}</span>
            {tooltip}
          </div>
          <Toggle
            fieldKey='html_editor_dynamic_extra_toggle'
            updater={this.onToggleChange}
            value={this.state.dynamicExtraToggleValue}
          />
        </div>
      )
    }

    return null
  }

  render () {
    const isDynamic = this.props.options && this.props.options.dynamicField
    const onlyDynamic = this.props.options && this.props.options.onlyDynamic
    const onlyDynamicCustomFields = this.props.options && this.props.options.onlyDynamicCustomFields

    const cssClasses = classNames({
      'vcv-ui-form-wp-tinymce': true,
      'vcv-is-invisible': this.state.editorLoaded !== true,
      'vcv-ui-form-field-dynamic-is-opened': this.state.dynamicFieldOpened,
      'vcv-ui-form-field-dynamic-is-active': this.state.isDynamicSet,
      'vcv-ui-form-field-has-dynamic': isDynamic,
      'vcv-ui-form-field-has-exception-field': this.state.exceptionField,
      'vcv-ui-form-field-only-dynamic': onlyDynamic
    })

    let dynamicComponent = null

    if (!onlyDynamic || onlyDynamicCustomFields) {
      dynamicComponent =
        <DynamicAttribute
          {...this.props}
          onOpen={this.handleDynamicFieldOpen}
          onClose={this.handleDynamicFieldClose}
          onDynamicFieldChange={this.handleDynamicFieldChange}
          setFieldValue={this.setFieldValue}
          value={this.state.value} // Must be not encoded
          onlyDynamicCustomFields={onlyDynamicCustomFields}
        />
    }

    return (
      <div className={cssClasses}>
        <HtmlEditor
          {...this.props}
          value={this.state.value} // Must be not encoded
          setFieldValue={this.setFieldValue}
          setValueState={this.setValueState}
          setEditorLoaded={this.setEditorLoaded}
          dynamicFieldOpened={this.state.dynamicFieldOpened}
          editorLoaded={this.state.editorLoaded}
        />
        {dynamicComponent}
        {this.getExtraToggle()}
      </div>
    )
  }
}
