import React from 'react'
import classNames from 'classnames'
import Representer from '../../representer'

export default class Backend extends Representer {
  render () {
    let output = `Font Family: ${this.state.value.fontFamily}`
    let classes = classNames({
      'vcv-wpbackend-attributes-content': true,
      'vcv-wpbackend-attr-representer-google-fonts': true
    })
    return <div className={classes}>
      {output}
    </div>
  }
}
