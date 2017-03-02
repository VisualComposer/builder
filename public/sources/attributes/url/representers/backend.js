import React from 'react'
import classNames from 'classnames'
import Representer from '../../representer'

export default class Backend extends Representer {
  render () {
    let { url } = this.state.value
    let link = url ? <a href={url} target='_blank'>{url}</a> : 'none'
    let classes = classNames({
      'vcv-wpbackend-attributes-content': true,
      'vcv-wpbackend-attr-representer-url': true
    })
    return <div className={classes}>
      Link: {link}
    </div>
  }
}
