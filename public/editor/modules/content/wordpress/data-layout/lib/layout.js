import vcCake from 'vc-cake'
import React from 'react'
import WordPressElement from './element'

const DocumentData = vcCake.getService('document')

class WordPressLayout extends React.Component {

  state = {
    data: []
  }
  elementsList = []

  componentDidMount () {
    this.props.api.reply(
      'data:changed', (document) => {
        this.setState({ data: document })
      }
    )
  }

  get elements () {
    if (!this.elementsList && this.state.data) {
      this.elementsList = this.state.data.map((element) => {
        let data = DocumentData.children(element.id)
        return (<WordPressElement element={element} data={data} key={element.id} api={this.props.api} />)
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

export default WordPressLayout
