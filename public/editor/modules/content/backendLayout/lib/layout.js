import React from 'react'
import {getData} from 'vc-cake'
// import Element from './element'
import Element from '../../layout/lib/element'
import BlankPageManagerBack from '../lib/helpers/BlankPageManagerBack/component'

export default class Layout extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      data: []
    }
  }

  componentDidMount () {
    this.props.api.reply('data:changed', (data) => {
      this.setState({ data: data })
    })
  }

  getElements () {
    let elementsList
    if (this.state.data) {
      elementsList = this.state.data.map((element) => {
        return (
          <Element element={element} key={element.id} api={this.props.api} />
        )
      })
    }
    return <div className='vcv-wpbackend-layout' data-vcv-module='content-layout'>
      {elementsList}
    </div>
  }

  getContent () {
    return this.state.data.length && getData('app:dataLoaded') ? this.getElements() : <BlankPageManagerBack api={this.props.api} iframe={false} />
  }

  render () {
    return this.getContent()
  }
}
