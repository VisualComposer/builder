/* eslint-disable import/no-webpack-loader-syntax */
/* eslint react/jsx-no-bind: "off" */

import React from 'react'
import vcCake from 'vc-cake'
import lodash from 'lodash'

import Attribute from '../attribute'
import DefaultLayouts from './lib/defaultLayouts'
import Toggle from '../toggle/Component'
import LayoutResponsiveness from './lib/layoutResponsiveness'
import Tooltip from '../../../components/tooltip/tooltip'
import AutoComplete from '../autocomplete/Component'

const dataManager = vcCake.getService('dataManager')
const elementsStorage = vcCake.getStorage('elements')

export default class Layout extends Attribute {
  static defaultProps = {
    layouts: [
      ['auto'],
      ['auto', 'auto'],
      ['auto', 'auto', 'auto'],
      ['auto', 'auto', 'auto', 'auto'],
      ['auto', 'auto', 'auto', 'auto', 'auto'],
      ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
      ['66.66%', '33.34%'],
      ['25%', '75%'],
      ['25%', '50%', '25%'],
      ['16.66%', '66.66%', '16.66%']
    ],
    suggestions: [
      { name: '100%' },
      { name: '50%' },
      { name: '33.33%' },
      { name: '25%' },
      { name: '20%' },
      { name: '16.66%' },
      { name: '66.66%' },
      { name: '75%' },
      { name: '100px' },
      { name: '300px' },
      { name: '500px' },
      { name: 'auto' },
      { name: 'hide' }
    ],
    fieldType: 'rowLayout'
  }

  static attributeMixins = {
    columnStyleMixin: {
      src: require('raw-loader!./cssMixins/columnStyles.pcss'),
      variables: {
        device: {
          value: false
        },
        selector: {
          value: false
        },
        numerator: {
          value: false
        },
        denominator: {
          value: false
        },
        columnGap: {
          value: false
        },
        spaceForColumn: {
          value: false
        },
        fullColumn: {
          value: false
        },
        autoColumn: {
          value: false
        },
        percentage: {
          value: false
        },
        percentageSelector: {
          value: false
        },
        pixels: {
          value: false
        }
      }
    }
  }

  static devices = ['xs', 'sm', 'md', 'lg', 'xl']
  static localizations = dataManager.get('localizations')
  static deviceData = [
    {
      deviceKey: 'xl',
      title: Layout.localizations ? Layout.localizations.desktop : 'Desktop',
      className: 'desktop'
    },
    {
      deviceKey: 'lg',
      title: Layout.localizations ? Layout.localizations.tabletLandscape : 'Tablet Landscape',
      className: 'tablet-landscape'
    },
    {
      deviceKey: 'md',
      title: Layout.localizations ? Layout.localizations.tabletPortrait : 'Tablet Portrait',
      className: 'tablet-portrait'
    },
    {
      deviceKey: 'sm',
      title: Layout.localizations ? Layout.localizations.mobileLandscape : 'Mobile Landscape',
      className: 'mobile-landscape'
    },
    {
      deviceKey: 'xs',
      title: Layout.localizations ? Layout.localizations.mobilePortrait : 'Mobile Portrait',
      className: 'mobile-portrait'
    }
  ]

  static buildMixins (data) {
    const layoutData = Layout.getLayoutData(data.id)

    if (!Object.prototype.hasOwnProperty.call(layoutData, 'all') && !Object.prototype.hasOwnProperty.call(layoutData, 'xs')) {
      return null
    }

    const newMixin = {}

    const columnGap = data.columnGap ? parseInt(data.columnGap) : 0
    const selector = `vce-row--col-gap-${columnGap}[data-vce-do-apply*='${data.id}']`
    const disableStacking = data && data.layout && Object.prototype.hasOwnProperty.call(data.layout, 'disableStacking') ? data.layout.disableStacking : false
    const responsivenessSettings = data && data.layout && Object.prototype.hasOwnProperty.call(data.layout, 'responsivenessSettings') ? data.layout.responsivenessSettings : false

    Layout.devices.forEach((device, index) => {
      if (disableStacking && device !== 'xs') {
        return
      }

      if (!disableStacking && !responsivenessSettings) {
        if (device === 'xs' || device === 'sm') {
          // No need to create styles for 100% width columns
          return
        }
        if (device === 'lg' || device === 'xl') {
          // No need to duplicate CSS for these devices, they are the same as md
          return
        }
      }

      if (!disableStacking && responsivenessSettings) {
        // Skip devices with same columns
        const prevDevice = Layout.devices[index - 1]
        if (device !== 'xs' && (lodash.isEqual(layoutData[prevDevice], layoutData[device]))) {
          return
        }
      }

      const currentLayout = layoutData.all || layoutData[device]
      const reducedLayout = []
      currentLayout.forEach((col) => {
        if (reducedLayout.indexOf(col) < 0) {
          reducedLayout.push(col)
        }
      })

      reducedLayout.forEach((col, index) => {
        if (col === '') {
          col = 'auto'
        }
        let mixinName = ''
        let fraction = ''
        let pixelsValue = ''
        if (col.indexOf('%') >= 0) {
          const numerator = parseFloat(col.replace('%', '').replace(',', '.'))
          fraction = [numerator, 100]
        } else if (col.includes('px')) {
          pixelsValue = parseInt(col)
        } else {
          fraction = col.split('/')
        }

        if (col !== 'auto') {
          if (col.includes('px') && pixelsValue) {
            mixinName = `${'columnStyleMixin'}:col${pixelsValue}-px:gap${columnGap}:${device}`
          } else {
            mixinName = `${'columnStyleMixin'}:col${fraction[0]}/${fraction[1]}:gap${columnGap}:${device}`
          }
        } else {
          mixinName = `${'columnStyleMixin'}:col${col}:gap${columnGap}:${device}`
        }

        if (device === 'xs') {
          if (!disableStacking && !responsivenessSettings) {
            mixinName = `${'columnStyleMixin'}:col1:xs`
          }
        }
        // put index in the beginning of key to sort columns
        mixinName = `${Layout.devices.indexOf(device)}:${mixinName}`

        newMixin[mixinName] = lodash.defaultsDeep({}, Layout.attributeMixins.columnStyleMixin)
        newMixin[mixinName].variables.selector.value = selector
        newMixin[mixinName].variables.device.value = device

        const percentages = (fraction[0] / fraction[1] * 100).toFixed(2)
        const spaceForColumn = (columnGap - (columnGap * (parseFloat(percentages) / 100))).toString()

        if (col !== 'auto') {
          if (col.includes('px')) {
            newMixin[mixinName].variables.pixels.value = pixelsValue
          } else {
            if (col.indexOf('%') >= 0) {
              newMixin[mixinName].variables.percentageSelector.value = col.replace('%', '').replace(',', '-').replace('.', '-')
            } else {
              newMixin[mixinName].variables.numerator.value = fraction[0]
              newMixin[mixinName].variables.denominator.value = fraction[1]
            }
            newMixin[mixinName].variables.percentage.value = percentages
          }
        } else {
          newMixin[mixinName].variables.autoColumn.value = true
        }
        newMixin[mixinName].variables.columnGap.value = columnGap.toString()
        newMixin[mixinName].variables.spaceForColumn.value = (Math.round(spaceForColumn * 100) / 100).toFixed(2)
      })
    })
    console.log(newMixin)
    return newMixin
  }

  static getLayoutData (rowId, getDefault) {
    const deviceLayoutData = {}
    const rowChildren = vcCake.getService('document').children(rowId)

    // Get layout for 'all'
    rowChildren.forEach((element) => {
      if (!element) {
        return
      }
      if (element.size && element.size.all) {
        if (!Object.prototype.hasOwnProperty.call(deviceLayoutData, 'all')) {
          deviceLayoutData.all = []
        }
        deviceLayoutData.all.push(element.size.all)
      }

      if (getDefault && element.size && element.size.defaultSize) {
        if (!Object.prototype.hasOwnProperty.call(deviceLayoutData, 'defaultSize')) {
          deviceLayoutData.defaultSize = []
        }
        deviceLayoutData.defaultSize.push(element.size.defaultSize)
      }
    })

    if (!Object.prototype.hasOwnProperty.call(deviceLayoutData, 'all')) { // Get layout for devices, if 'all' is not defined
      Layout.devices.forEach((device) => {
        rowChildren.forEach((element) => {
          if (!element) {
            return
          }
          if (!Object.prototype.hasOwnProperty.call(deviceLayoutData, device)) {
            deviceLayoutData[device] = []
          }
          if (element.size && typeof element.size === 'string') {
            deviceLayoutData[device].push(element.size)
          } else if (element.size && element.size.hasOwnProperty && Object.prototype.hasOwnProperty.call(element.size, device)) {
            deviceLayoutData[device].push(element.size[device])
          } else {
            deviceLayoutData[device].push('auto')
          }
        })
      })
    }
    return deviceLayoutData
  }

  constructor (props) {
    super(props)
    this.handleActiveLayoutChange = this.handleActiveLayoutChange.bind(this)
    this.validateSize = this.validateSize.bind(this)
    this.valueChangeHandler = this.valueChangeHandler.bind(this)
    this.handleColumnHover = this.handleColumnHover.bind(this)
    this.onAutocompleteChange = this.onAutocompleteChange.bind(this)
    this.dataUpdate = lodash.debounce(this.dataUpdate.bind(this), 50)
  }

  componentDidMount () {
    elementsStorage.on(`element:${this.props.elementAccessPoint.id}`, this.dataUpdate)
  }

  componentWillUnmount () {
    elementsStorage.off(`element:${this.props.elementAccessPoint.id}`, this.dataUpdate)
  }

  dataUpdate (data, source, options) {
    if (options && options.changedAttributeType && options.changedAttributeType === 'rowLayout') {
      const deviceLayoutData = Layout.getLayoutData(this.props.elementAccessPoint.id, true)
      const currentValue = this.state.value
      const defaultLayoutData = deviceLayoutData.defaultSize ? deviceLayoutData.defaultSize : []
      currentValue.layoutData = deviceLayoutData
      currentValue.defaultLayoutData = defaultLayoutData
      this.setState({
        value: currentValue
      })
    }
  }

  updateState (props) {
    let deviceLayoutData = {}

    if (props.value && props.value.layoutData && (props.value.layoutData.all || props.value.layoutData.xs)) {
      deviceLayoutData = props.value.layoutData
    } else {
      deviceLayoutData = Layout.getLayoutData(props.elementAccessPoint.id, true)
    }

    const defaultLayoutData = deviceLayoutData.defaultSize ? deviceLayoutData.defaultSize : []
    const reverseColumnState = props.value && props.value.reverseColumn ? props.value.reverseColumn : false
    const disableStackingState = props.value && props.value.disableStacking ? props.value.disableStacking : false
    const responsivenessSettingsState = props.value && props.value.responsivenessSettings ? props.value.responsivenessSettings : false
    return {
      value: {
        layoutData: deviceLayoutData,
        defaultLayoutData: defaultLayoutData,
        reverseColumn: reverseColumnState,
        disableStacking: disableStackingState,
        responsivenessSettings: responsivenessSettingsState
      }
    }
  }

  updateDevicesLayout (defaultLayout, newState) {
    newState.layoutData.all = defaultLayout
    newState.defaultLayoutData = defaultLayout
    for (const device in newState.layoutData) {
      if (Object.prototype.hasOwnProperty.call(newState.layoutData, device)) {
        const deviceLayout = newState.layoutData[device]
        if (device !== 'all') {
          deviceLayout.length = 0
          defaultLayout.forEach((col, i) => {
            if (!deviceLayout[i] && col) {
              deviceLayout.push((device === 'xs' || device === 'sm') ? '100%' : col)
            }
          })
        }
      }
    }
    return newState
  }

  handleActiveLayoutChange (layout, options) {
    let newState = lodash.defaultsDeep({}, this.state.value)
    if (options && options.device) {
      newState.layoutData[options.device][options.index] = layout
    } else {
      newState = this.updateDevicesLayout(layout, newState)
    }
    this.setFieldValue(newState)
  }

  setFieldValue (value) {
    const { updater, fieldKey } = this.props
    const { layoutData, defaultLayoutData, ...rest } = value
    if (value.responsivenessSettings) {
      const mobileDeviceLayout = layoutData.all ? layoutData.all.map(() => { return '100%' }) : []
      if (!layoutData.xs) {
        layoutData.xs = mobileDeviceLayout
      }
      if (!layoutData.sm) {
        layoutData.sm = mobileDeviceLayout
      }
      layoutData.md = layoutData.md || layoutData.all
      layoutData.lg = layoutData.lg || layoutData.all
      layoutData.xl = layoutData.xl || layoutData.all
      delete layoutData.all
    } else {
      const validValuesRegex = /\d+%|\d+px/g
      const isInvalidLayoutValue = defaultLayoutData.length === 1 && (!defaultLayoutData[0] || !defaultLayoutData[0].match(validValuesRegex))
      if (isInvalidLayoutValue && defaultLayoutData[0] !== 'hide') {
        defaultLayoutData[0] = 'auto'
      }
      layoutData.all = defaultLayoutData
      delete layoutData.xs
      delete layoutData.sm
      delete layoutData.md
      delete layoutData.lg
      delete layoutData.xl
    }
    const sanitizedValue = {}
    for (const device in layoutData) {
      if (Object.prototype.hasOwnProperty.call(layoutData, device)) {
        const convertToEmpty = device !== 'defaultSize' && device !== 'all'
        sanitizedValue[device] = this.sanitizeLayout(layoutData[device], convertToEmpty)
      }
    }
    updater(fieldKey, {
      layoutData: sanitizedValue,
      ...rest
    })
    this.setState({
      value: value
    })
  }

  sanitizeLayout (value, convertToEmpty) {
    const newValue = []

    value.map((col) => {
      const isValid = this.validateSize(col)
      if (isValid) {
        newValue.push(col)
      } else if (convertToEmpty) {
        newValue.push('')
      }
    })

    return newValue
  }

  validateSize (text) {
    if (text === 'auto' || text === 'hide') {
      return true
    }
    const fractionRegex = /^(\d+)\/(\d+)$/

    if (fractionRegex.test(text)) {
      // test if fraction is less than 1
      const results = fractionRegex.exec(text)
      const numerator = parseInt(results[1])
      const denominator = parseInt(results[2])
      return numerator <= denominator
    }

    const percentageRegex = /^(\d+)([,.]\d+)?%/
    if (percentageRegex.test(text)) {
      // test if percentage is more than 1 and less than 100
      const percentage = parseFloat(text.replace('%', '').replace(',', '.'))
      return percentage >= 1 && percentage <= 100
    } else if (text.includes('px')) {
      return parseFloat(text) > 0
    }
    return false
  }

  getReverseToggle () {
    const data = this.state.value
    const useReverseStackingToggle = Layout.localizations ? Layout.localizations.useReverseStackingToggle : 'Use Reverse stacking toggle to stack columns from right to left on mobile devices.'
    if (data && data.disableStacking) {
      return null
    }
    const reverseState = data && Object.prototype.hasOwnProperty.call(data, 'reverseColumn') ? data.reverseColumn : false
    return (
      <div className='vcv-ui-form-group'>
        <div className='vcv-ui-form-layout-reverse-column-toggle'>
          <Toggle
            api={this.props.api}
            fieldKey='reverseColumn'
            updater={this.valueChangeHandler}
            options={{ labelText: 'Reverse column stacking' }}
            value={reverseState}
          />
          <Tooltip>
            {useReverseStackingToggle}
          </Tooltip>
        </div>
      </div>
    )
  }

  valueChangeHandler (fieldKey, value) {
    const newState = lodash.defaultsDeep({}, this.state.value)
    newState[fieldKey] = value
    if (fieldKey === 'responsivenessSettings' && value && newState.disableStacking) {
      newState.disableStacking = false
    }
    this.setFieldValue(newState)
    if (fieldKey === 'rowLayout') {
      // From autocomplete
      this.handleActiveLayoutChange(value)
    }
  }

  onAutocompleteChange (fieldKey, value) {
    const parsedValue = value.map((item) => {
      return item.name
    })

    this.valueChangeHandler(fieldKey, parsedValue)
  }

  getStackingToggle () {
    const data = this.state.value
    if (data && data.responsivenessSettings) {
      return null
    }
    const disableStackingState = data && Object.prototype.hasOwnProperty.call(data, 'disableStacking') ? data.disableStacking : false
    return (
      <div className='vcv-ui-form-group'>
        <div className='vcv-ui-form-layout-disable-stacking-toggle'>
          <Toggle
            api={this.props.api}
            fieldKey='disableStacking'
            updater={this.valueChangeHandler}
            options={{ labelText: 'Disable column stacking' }}
            value={disableStackingState}
          />
        </div>
      </div>
    )
  }

  getResponsiveToggle () {
    const data = this.state.value
    const enableCustomResponsivness = Layout.localizations ? Layout.localizations.enableCustomResponsivness : 'Enable custom responsiveness to control column width on different devices.'
    const responsivenessSettingsState = data && Object.prototype.hasOwnProperty.call(data, 'responsivenessSettings') ? data.responsivenessSettings : false
    return (
      <div className='vcv-ui-form-group'>
        <div className='vcv-ui-form-custom-responsiveness-toggle'>
          <Toggle
            api={this.props.api}
            fieldKey='responsivenessSettings'
            updater={this.valueChangeHandler}
            options={{ labelText: 'Custom responsiveness settings' }}
            value={responsivenessSettingsState}
          />
          <Tooltip>
            {enableCustomResponsivness}
          </Tooltip>
        </div>
      </div>
    )
  }

  handleColumnHover (options) {
    const newState = {}
    newState[options.type] = options.over ? options.index : false
    this.setState(newState)
  }

  render () {
    const { layoutData, responsivenessSettings, defaultLayoutData } = this.state.value

    const LayoutData = defaultLayoutData.map((item) => {
      return { name: item }
    })

    let responsivenessContent = null
    if (responsivenessSettings) {
      responsivenessContent = (
        <LayoutResponsiveness
          layouts={this.props.layouts}
          layoutData={layoutData}
          onChange={this.handleActiveLayoutChange}
          validator={this.validateSize}
          devices={Layout.deviceData}
          defaultLayoutData={defaultLayoutData}
          activeColumn={this.state.activeColumn}
          onColumnHover={this.handleColumnHover}
          {...this.props}
        />
      )
    }

    const showSuggestionsOnFocus = true
    const isNewAutocomplete = true
    const isTagEditable = true

    return (
      <div className='vcv-ui-form-layout'>
        <DefaultLayouts
          layouts={this.props.layouts} value={this.sanitizeLayout(defaultLayoutData)}
          onChange={this.handleActiveLayoutChange}
        />
        <div className='vcv-ui-form-layout-custom-layout'>
          <div className='vcv-ui-form-group-heading-wrapper'>
            <span className='vcv-ui-form-group-heading'>Custom row layout</span>
            <Tooltip>
              Enter custom layout option for columns by using percentages, pixels, fractions or ‘auto’ value (ex. 300px + auto; 50% + 50%; 1/3 + 1/3 + 1/3).
            </Tooltip>
          </div>
          <div className='vcv-ui-row vcv-ui-row-gap--md'>
            <div className='vcv-ui-col vcv-ui-col--md-6 vcv-ui-form-group'>
              <div className='vcv-ui-form-layout-custom-layout-columns'>
                <div className='vcv-ui-form-layout-custom-layout-col vcv-ui-form-layout-custom-layout-input-wrapper'>
                  <div className='vcv-ui-form-layout-custom-layout-input'>
                    <AutoComplete
                      fieldKey='rowLayout'
                      updater={this.onAutocompleteChange}
                      value={LayoutData}
                      suggestions={this.props.suggestions}
                      showSuggestionsOnFocus={showSuggestionsOnFocus}
                      options={{}}
                      isNewAutocomplete={isNewAutocomplete}
                      isTagEditable={isTagEditable}
                      validator={this.validateSize}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='vcv-ui-col vcv-ui-col--md-6'>
              {this.getStackingToggle()}
              {this.getReverseToggle()}
            </div>
          </div>
        </div>
        <div className='vcv-ui-form-layout-responsiveness'>
          {this.getResponsiveToggle()}
          {responsivenessContent}
        </div>
      </div>
    )
  }
}
