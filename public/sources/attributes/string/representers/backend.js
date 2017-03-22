import React from 'react'
import classNames from 'classnames'
import Representer from '../../representer'
import { getService } from 'vc-cake'

const cook = getService('cook')

export default class Backend extends Representer {
  render () {
    let { value } = this.state
    let options = cook.get({tag: this.props.element.tag}).settings(this.props.fieldKey).settings.options
    let label = options.label
    let link = options.hasOwnProperty('link') && options.link ? <a href={value} target='_blank'>{value}</a> : ''
    let output = link || value
    let classes = classNames({
      'vcv-wpbackend-attributes-content': true,
      'vcv-wpbackend-attributes-content-block': true,
      'vcv-wpbackend-attr-representer-string': true
    })
    return <div className={classes}>
      {label}: {output}
    </div>
  }
}
