import React from 'react'
import classNames from 'classnames'
import Representer from '../../representer'
import { getService } from 'vc-cake'

const cook = getService('cook')

export default class Backend extends Representer {
  render () {
    let label = cook.get({tag: this.props.element.tag}).settings(this.props.fieldKey).settings.options.label
    let output = `${label}: ${this.state.value} ;`
    let classes = classNames({
      'vcv-wpbackend-attributes-content': true,
      'vcv-wpbackend-attr-representer-string': true
    })
    return <div className={classes}>
      {output}
    </div>
  }
}
