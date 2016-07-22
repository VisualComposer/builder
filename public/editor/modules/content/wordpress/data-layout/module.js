/*eslint no-extra-bind: "off"*/

import vcCake from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import Element from './lib/element'
import './css/module.less'

class Layout extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      data: []
    }
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

  render () {
    let elementsList
    if (this.state.data) {
      let document = vcCake.getService('document')
      elementsList = this.state.data.map((element) => {
        let data = document.children(element.id)
        return <Element element={element} data={data} key={element.id} api={this.props.api} />
      })
    }
    return (<div className='vcv-layouts-clean-html'>
      {elementsList}
    </div>)
  }
}
Layout.propTypes = {
  api: React.PropTypes.object.isRequired
}

vcCake.add('content-wordpress-data-layout', (api) => {
  // Here comes wrapper for navbar
  var wrapper = document.createElement('div')
  wrapper.setAttribute('id', 'vc-wp-data-layout')
  document.body.appendChild(wrapper)
  ReactDOM.render(
    <Layout api={api} />,
    wrapper
  )
})
