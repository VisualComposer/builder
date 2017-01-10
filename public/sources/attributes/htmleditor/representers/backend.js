import React from 'react'
import Representer from '../../representer'

export default class Backend extends Representer {
  constructor (props) {
    super(props)
    this.handleChangeQtagsEditor = this.handleChangeQtagsEditor.bind(this)
  }
  render () {
    return <div className='vcv-wpbackend-attr-representer-htmleditor' dangerouslySetInnerHTML={{__html: this.state.value}} />
  }
}
