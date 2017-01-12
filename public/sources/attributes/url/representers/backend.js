import React from 'react'
import classNames from 'classnames'
import Representer from '../../representer'

export default class Backend extends Representer {
  render () {
    let link = this.state.value.url ? this.state.value.url : 'none'
    let output = `Link: ${link};`
    let classes = classNames({
      'vcv-wpbackend-attributes-content': true,
      'vcv-wpbackend-attr-representer-url': true
    })
    return <div className={classes}>
      {output}
    </div>
  }
}
