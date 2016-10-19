import React from 'react'
import WordPressElement from './element'

export default class WordPressLayout extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired
  }
  state = {
    data: []
  }
  componentDidMount () {
    this.props.api.reply(
      'data:changed', (document) => {
        this.setState({ data: document })
      }
    )
  }

  get elements () {
    if (this.state.data) {
      return this.state.data.map((element) => {
        return <WordPressElement element={element} key={element.id} api={this.props.api} />
      })
    }
    return null
  }

  render () {
    return (
      <div className='vcv-layouts-clean-html'>
        {this.elements}
      </div>
    )
  }
}
