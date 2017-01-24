import React from 'react'
import ReactDOM from 'react-dom'
import { getData } from 'vc-cake'
import Element from './element'
import BlankPageManagerBack from '../lib/helpers/BlankPageManagerBack/component'

export default class Layout extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      data: [],
      activeElementId: '',
      layout: {}
    }
    this.handleOpenElement = this.handleOpenElement.bind(this)
  }

  componentDidMount () {
    this.props.api.reply('data:changed', (data) => {
      this.setState({
        data: data
      })
      if (ReactDOM.findDOMNode(this).classList.contains('vcv-wpbackend-layout')) {
        this.setState({
          layout: ReactDOM.findDOMNode(this)
        })
      }
    })
  }

  handleOpenElement (id) {
    this.setState({ activeElementId: id })
  }

  getElements () {
    let { data, activeElementId, layout } = this.state
    let elementsList
    if (data) {
      elementsList = data.map((element) => {
        return (
          <Element
            element={element}
            key={'vcvLayoutGetElements' + element.id}
            api={this.props.api}
            openElement={this.handleOpenElement}
            activeElementId={activeElementId}
            layout={layout}
          />
        )
      })
    }
    return <div className='vcv-wpbackend-layout' data-vcv-module='content-layout'>
      {elementsList}
    </div>
  }

  render () {
    return this.state.data.length && getData('app:dataLoaded') ? this.getElements() : <BlankPageManagerBack api={this.props.api} iframe={false} />
  }
}
