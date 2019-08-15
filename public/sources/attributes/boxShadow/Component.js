/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react'
import Attribute from '../attribute'
import lodash from 'lodash'
import Toggle from '../toggle/Component'
import Color from '../color/Component'
import Range from '../range/Component'

const BoxShadowEffects = [
  {
    fieldKey: 'horizontalOffset',
    value: '0',
    min: -300,
    max: 300,
    measurement: 'px',
    description: 'Horizontal offset',
    attributeType: 'range'
  },
  {
    fieldKey: 'verticalOffset',
    value: '5',
    min: -300,
    max: 300,
    measurement: 'px',
    description: 'Vertical offset',
    attributeType: 'range'
  },
  {
    fieldKey: 'blurRadius',
    value: '8',
    min: 0,
    max: 300,
    measurement: 'px',
    description: 'Blur radius',
    attributeType: 'range'
  },
  {
    fieldKey: 'spreadRadius',
    value: '3',
    min: -300,
    max: 300,
    measurement: 'px',
    description: 'Spread radius',
    attributeType: 'range'
  },
  {
    fieldKey: 'shadowColor',
    value: '#555',
    description: 'Shadow color',
    attributeType: 'color'
  }
]

export default class BoxShadow extends Attribute {
  static defaultProps = {
    fieldType: 'boxShadow'
  }

  static deviceDefaults = {
    boxShadowEnable: false,
    horizontalOffset: '0',
    verticalOffset: '0',
    blurRadius: '4',
    spreadRadius: '2',
    shadowColor: 'rgba(85, 85, 85, 0.5)'
  }

  static defaultState = {
    currentDevice: 'all',
    devices: {},
    attributeMixins: {}
  }

  static attributeMixins = {
    boxShadow: {
      src: require('raw-loader!./cssMixins/boxShadow.pcss'),
      variables: {
        device: {
          value: `all`
        }
      }
    }
  }

  static addPixelToNumber (number) {
    return /^-?\d+$/.test(number) ? `${number}px` : number
  }

  static getMixins (newValue, device, newMixins) {
    if (newValue[ device ].hasOwnProperty('boxShadow')) {
      const value = newValue[ device ].boxShadow
      const mixinName = `boxShadowMixin:${device}`
      newMixins[ mixinName ] = lodash.defaultsDeep({}, BoxShadow.attributeMixins.boxShadow)
      newMixins[ mixinName ].variables.device = {
        value: device
      }
      newMixins[ mixinName ].variables.boxShadow = {
        value: value
      }
    }
    return device
  }

  constructor (props) {
    super(props)
    props.setInnerFieldStatus && props.setInnerFieldStatus()
    this.valueChangeHandler = this.valueChangeHandler.bind(this)
  }

  updateValue (newState, fieldKey) {
    let newValue = {}
    let newMixins = {}

    // prepare data for state
    newState = this.updateState(newState)
    // save only needed data
    let checkDevices = []
    if (newState.currentDevice === 'all') {
      checkDevices.push('all')
    }

    checkDevices.forEach((device) => {
      if (!lodash.isEmpty(newState.devices[ device ])) {
        if (!newState.devices[ device ].boxShadowEnable) {
          newState.devices[ device ].boxShadowEnable = BoxShadow.deviceDefaults.boxShadowEnable
        }
        if (!newState.devices[ device ].shadowColor) {
          newState.devices[ device ].shadowColor = BoxShadow.deviceDefaults.shadowColor
        }

        // Compile and assign actual box-shadow value
        const horizontalOffset = BoxShadow.addPixelToNumber(newState.devices[ device ].horizontalOffset)
        const verticalOffset = BoxShadow.addPixelToNumber(newState.devices[ device ].verticalOffset)
        const blurRadius = BoxShadow.addPixelToNumber(newState.devices[ device ].blurRadius)
        const spreadRadius = BoxShadow.addPixelToNumber(newState.devices[ device ].spreadRadius)
        const shadowColor = newState.devices[ device ].shadowColor
        newState.devices[ device ].boxShadow = `${horizontalOffset} ${verticalOffset} ${blurRadius} ${spreadRadius} ${shadowColor}`

        newValue[ device ] = lodash.defaultsDeep({}, newState.devices[ device ])
        device = BoxShadow.getMixins(newValue, device, newMixins)

        // remove device from list if it's empty
        if (!Object.keys(newValue[ device ]).length) {
          delete newValue[ device ]
        }
      }
    })

    this.setFieldValue(newValue, newMixins, fieldKey)
    this.setState(newState)
  }

  updateState (props) {
    let newState = {}
    // data came from props if there is set value
    if (props.value) {
      newState = this.parseValue(props.value)
    } else {
      // data came from state update
      newState = lodash.defaultsDeep({}, props, BoxShadow.defaultState)
    }
    return newState
  }

  valueChangeHandler (fieldKey, value) {
    let newState = lodash.defaultsDeep({}, this.state)
    newState.devices[ newState.currentDevice ][ fieldKey ] = value
    this.updateValue(newState, fieldKey)
  }

  parseValue (value) {
    // set default values
    let newState = lodash.defaultsDeep({}, BoxShadow.defaultState)
    // get devices data
    let devices = []
    // set current device
    if (!lodash.isEmpty(value.device)) {
      newState.currentDevice = Object.keys(value.device).shift()
    }
    // update devices values
    devices.push('all')
    devices.forEach((device) => {
      newState.devices[ device ] = lodash.defaultsDeep({}, BoxShadow.deviceDefaults)
      if (value.device && value.device[ device ]) {
        newState.devices[ device ] = lodash.defaultsDeep({}, value.device[ device ], newState.devices[ device ])
      }
    })

    return newState
  }

  setFieldValue (value, mixins, innerFieldKey) {
    let { updater, fieldKey } = this.props
    updater(fieldKey, {
      device: value,
      attributeMixins: mixins
    }, innerFieldKey)
  }

  getBoxShadowToggle () {
    const fieldKey = 'boxShadowEnable'
    const deviceData = this.state.devices[ this.state.currentDevice ]
    const value = deviceData[ fieldKey ] || false
    const labelText = 'Enable box shadow'

    return (
      <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
        <Toggle
          api={this.props.api}
          fieldKey={fieldKey}
          updater={this.valueChangeHandler}
          options={{ labelText: labelText }}
          value={value}
        />
      </div>
    )
  }

  getBoxShadowFields () {
    const deviceData = this.state.devices[ this.state.currentDevice ]

    if (!deviceData[ 'boxShadowEnable' ]) {
      return null
    }

    const getFields = BoxShadowEffects.map((effect, i) => {
      let field
      if (effect.attributeType === 'range') {
        field = <Range
          api={this.props.api}
          fieldKey={effect.fieldKey}
          updater={this.valueChangeHandler}
          options={{ min: effect.min, max: effect.max, measurement: effect.measurement }}
          value={deviceData[ effect.fieldKey ]}
        />
      } else {
        field = <Color
          api={this.props.api}
          fieldKey={effect.fieldKey}
          updater={this.valueChangeHandler}
          value={deviceData[ effect.fieldKey ] || effect.value}
          defaultValue={effect.value}
        />
      }

      return <div className='vcv-ui-form-group' key={`box-shadow-fields-${effect.fieldKey}`}>
        <span className='vcv-ui-form-group-heading'>{effect.description}</span>
        {field}
      </div>
    })

    return <React.Fragment>
      {getFields}
    </React.Fragment>
  }

  render () {
    return (
      <div className='vcv-ui-box-shadow'>
        {this.getBoxShadowToggle()}
        {this.getBoxShadowFields()}
      </div>
    )
  }
}
