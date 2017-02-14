import React from 'react'
import { getData } from 'vc-cake'
import Element from './element'
import BlankPageManagerBack from './helpers/BlankPageManagerBack/component'

export default class Layout extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      data: [],
      activeElementId: ''
    }
    this.handleOpenElement = this.handleOpenElement.bind(this)
  }

  componentDidMount () {
    this.props.api.reply('data:changed', (data) => {
      this.setState({
        data: data
      })
    })
  }

  handleOpenElement (id) {
    this.setState({ activeElementId: id })
  }

  getElements () {
    let { data, activeElementId } = this.state
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
          />
        )
      })
    }

    return <div className='vcv-wpbackend-layout' data-vcv-module='content-layout'>
      {elementsList}
    </div>
  }

  render () {
    if (!this.state.data.length && !getData('app:dataLoaded')) {
      return <div className='vcv-wpbackend-layout-loading'>
        <span className='vcv-ui-wp-spinner' />
      </div>
    }

    if (!this.state.data.length && getData('app:dataLoaded')) {
      return <BlankPageManagerBack api={this.props.api} iframe={false} />
    }

    return this.getElements()
  }
}
