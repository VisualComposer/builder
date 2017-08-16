import React from 'react'
import classNames from 'classnames'
import Representer from '../../representer'
import { getService } from 'vc-cake'
import options from '../options'

const cook = getService('cook')

export default class Backend extends Representer {
  render () {
    let {input, select} = this.state.value
    let cookElement = cook.get({tag: this.props.element.tag})
    let label = cookElement.settings(this.props.fieldKey).settings.options.label
    let type = cookElement.settings(this.props.fieldKey).settings.options.type
    let values = [...(options[type] || []), ...cookElement.settings(this.props.fieldKey).settings.options.values]
    let value = values.find((value) => {
      return value.value === select
    })
    let selectLabel = value.label
    if (type === 'currency') {
      selectLabel = `${value.label} (${value.value.replace('_', '')})`
    }
    let output = `${label}: ${input} ${selectLabel}`
    let classes = classNames({
      'vcv-wpbackend-attributes-content': true,
      'vcv-wpbackend-attr-representer-dropdown': true
    })
    return <div className={classes}>
      {output}
    </div>
  }
}
