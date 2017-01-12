import React from 'react'
import classNames from 'classnames'
import Representer from '../../representer'
import { getService } from 'vc-cake'

const cook = getService('cook')

export default class Backend extends Representer {
  render () {
    let label = cook.get({tag: this.props.element.tag}).settings(this.props.fieldKey).settings.options.label
    let value = this.state.value.charAt(0).toUpperCase() + this.state.value.slice(1)
    let output = `${label}: ${value};`
    let classes = classNames({
      'vcv-wpbackend-attributes-content': true,
      'vcv-wpbackend-attr-representer-dropdown': true
    })
    return <div className={classes}>
      {output}
    </div>
  }
}
