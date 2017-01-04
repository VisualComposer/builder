import React from 'react'
import Element from '../../layout/lib/element'

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
    // TODO: import blank page
    return this.state.data.length ? this.getElements() : <div className='vcv-ui-tree-layout-messages'>Blank Page placeholder</div>
  }

  render () {
    return this.getContent()
  }
}
