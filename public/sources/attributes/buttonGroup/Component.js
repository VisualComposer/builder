import React from 'react'
import Attribute from '../attribute'
import classNames from 'classnames'

export default class ButtonGroup extends Attribute {
  selectChildren = null
  types = [
    {
      type: 'alignment',
      values: [
        {
          value: 'left',
          icon: 'vcv-ui-icon-attribute-alignment-left'
        },
        {
          value: 'right',
          icon: 'vcv-ui-icon-attribute-alignment-right'
        },
        {
          value: 'center',
          icon: 'vcv-ui-icon-attribute-alignment-center'
        }
      ]
    },
    {
      type: 'size',
      values: [
        {
          value: 'tiny',
          icon: 'vcv-ui-icon-attribute-size-xs'
        },
        {
          value: 'small',
          icon: 'vcv-ui-icon-attribute-size-s'
        },
        {
          value: 'medium',
          icon: 'vcv-ui-icon-attribute-size-m'
        },
        {
          value: 'large',
          icon: 'vcv-ui-icon-attribute-size-l'
        }
      ]
    },
    {
      type: 'shape',
      values: [
        {
          value: 'square',
          icon: 'vcv-ui-icon-attribute-shape-square'
        },
        {
          value: 'round',
          icon: 'vcv-ui-icon-attribute-shape-round'
        },
        {
          value: 'rounded',
          icon: 'vcv-ui-icon-attribute-shape-rounded'
        }
      ]
    },
    {
      type: 'row-width',
      values: [
        {
          value: 'boxed',
          icon: 'vcv-ui-icon-attribute-row-width-boxed'
        },
        {
          value: 'stretched-content',
          icon: 'vcv-ui-icon-attribute-row-width-stretched-content'
        },
        {
          value: 'stretched',
          icon: 'vcv-ui-icon-attribute-row-width-stretched'
        }
      ]
    },
    {
      type: 'vertical-alignment',
      values: [
        {
          value: 'bottom',
          icon: 'vcv-ui-icon-attribute-vertical-alignment-bottom'
        },
        {
          value: 'middle',
          icon: 'vcv-ui-icon-attribute-vertical-alignment-middle'
        },
        {
          value: 'top',
          icon: 'vcv-ui-icon-attribute-vertical-alignment-top'
        }
      ]
    }
  ]

  componentWillReceiveProps (nextProps) {
    super.componentWillReceiveProps(nextProps)
    this.generateSelectChildren(nextProps)
  }

  componentWillMount () {
    this.generateSelectChildren(this.props)
  }

  createGroup (key, groupObject, fieldKey) {
    let optionElements = []
    let { values, label } = groupObject
    let labelValue = label.replace(/\s+/g, '')
    for (let key in values) {
      if (values.hasOwnProperty(key)) {
        optionElements.push(this.createOptions(key, values, fieldKey))
      }
    }
    return <optgroup key={fieldKey + ':' + key + ':' + labelValue} label={label}>{optionElements}</optgroup>
  }

  createOptions (key, values, fieldKey) {
    let value = values[ key ].value
    let label = values[ key ].label
    return <option key={fieldKey + ':' + key + ':' + value} value={value}>{label}</option>
  }

  getSelectOptions (props) {
    if (!props) {
      props = this.props
    }
    let { values } = props.options || {}
    let { global } = props.options || {}
    if (global && (!values || !values.length)) {
      values = window[ global ] || []
    }

    return values
  }

  generateSelectChildren (props) {
    let optionElements = []
    let values = this.getSelectOptions(props)
    let { fieldKey } = props

    for (let key in values) {
      if (values.hasOwnProperty(key)) {
        if (values[ key ].hasOwnProperty('group')) {
          optionElements.push(this.createGroup(key, values[ key ].group, fieldKey))
        } else {
          optionElements.push(this.createOptions(key, values, fieldKey))
        }
      }
    }

    this.selectChildren = optionElements
  }

  getItems () {
    let currentTypes = this.types.find((type) => {
      return this.props.options.type === type.type
    })
    return this.props.options.values.map((value, i) => {
      let buttonClasses = ['vcv-ui-form-button']
      let iconClasses = ['vcv-ui-icon-attribute']
      iconClasses.push(currentTypes.values[i].icon)
      if (value.value === this.state.value) {
        buttonClasses.push('vcv-ui-form-button--active')
      }
      iconClasses = classNames(iconClasses)
      buttonClasses = classNames(buttonClasses)
      return <span
        className={buttonClasses}
        title={value.label}
        key={`vcv-ui-button-group-attribute-${this.props.fieldKey}-${i}`}
      >
        <i className={iconClasses} />
      </span>
    })
  }

  render () {
    return (
      <div className='vcv-ui-form-buttons-group vcv-ui-form-button-group--attribute'>
        {this.getItems()}
      </div>
    )
  }
}
