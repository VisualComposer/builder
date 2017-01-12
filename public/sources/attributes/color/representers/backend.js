import React from 'react'
import classNames from 'classnames'
import Representer from '../../representer'

export default class Backend extends Representer {
  render () {
    let output = `${this.state.value};`
    let classes = classNames({
      'vcv-wpbackend-attributes-content': true,
      'vcv-wpbackend-attr-representer-color': true
    })
    let sampleClasses = classNames({
      'vcv-wpbackend-attr-representer-color--sample': true
    })
    let valueClasses = classNames({
      'vcv-wpbackend-attr-representer-color--value': true
    })
    return <div className={classes}>
      <span className={sampleClasses} style={{background: this.state.value}} />
      <span className={valueClasses}>{output}</span>
    </div>
  }
}
