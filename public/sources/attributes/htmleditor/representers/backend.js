import React from 'react'
import classNames from 'classnames'
import Representer from '../../representer'

export default class Backend extends Representer {
  render () {
    let classes = classNames({
      'vcv-wpbackend-attributes-content': true,
      'vcv-wpbackend-attributes-content-block': true,
      'vcv-wpbackend-attr-representer-htmleditor': true
    })
    return <div className={classes} dangerouslySetInnerHTML={{__html: this.state.value}} />
  }
}
