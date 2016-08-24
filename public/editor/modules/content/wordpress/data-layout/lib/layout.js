import React from 'react'
import WordPressElement from './element'

class WordPressLayout extends React.Component {
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
        return (
          <WordPressElement element={element} key={element.id} api={this.props.api} />
        )
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
WordPressLayout.propTypes = {
  api: React.PropTypes.object.isRequired
}

export default WordPressLayout
