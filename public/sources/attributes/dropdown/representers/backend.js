import React from 'react'
import classNames from 'classnames'
import Representer from '../../representer'
import { getService } from 'vc-cake'

const cook = getService('cook')

export default class Backend extends Representer {
  render () {
    let cookElement = cook.get({ tag: this.props.element.tag })
    let label = cookElement.settings(this.props.fieldKey).settings.options.label
    let value = cookElement.settings(this.props.fieldKey).settings.options.values.find((value) => {
      return value.value === this.state.value
    })
    let output = `${label}: ${value.label};`
    let classes = classNames({
      'vcv-wpbackend-attributes-content': true,
      'vcv-wpbackend-attr-representer-dropdown': true
    })
    return <div className={classes}>
      {output}
    </div>
  }
}
