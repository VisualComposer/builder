import vcCake from 'vc-cake'
import React from 'react'
import WordPressElement from './element'

class WordPressLayout extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      data: []
    }
    this.elementsList = []
  }

  componentDidMount () {
    this.props.api.reply(
      'data:changed', (document) => {
        this.setState({ data: document })
      }
    )
  }

  get elements () {
    if (!this.elementsList && this.state.data) {
      const document = vcCake.getService('document')
      this.elementsList = this.state.data.map((element) => {
        let data = document.children(element.id)
        return <WordPressElement element={element} data={data} key={element.id} api={this.props.api} />
      })
    }
    return this.elementsList
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

module.exports = WordPressLayout
