/*eslint no-extra-bind: "off"*/

import vcCake from 'vc-cake'
import React from 'react'
import Element from './element'

class Layout extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      data: []
    }
    this.elementsList = []
  }

  componentDidMount () {
    this.props.api.reply(
      'data:changed',
      (
        (document) => {
          this.setState({ data: document })
        }
      ).bind(this)
    )
  }

  get elements () {
    if (!this.elementsList && this.state.data) {
      let document = vcCake.getService('document')
      this.elementsList = this.state.data.map(((element) => {
        let data = document.children(element.id)
        return <Element element={element} data={data} key={element.id} api={this.props.api} />
      }).bind(this))
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
Layout.propTypes = {
  api: React.PropTypes.object.isRequired
}

module.exports = Layout
