import vcCake from 'vc-cake'
import React from 'react'
import Element from './element.js'

// TODO: move styles to sources/less
// import '../css/tree/init.less'
// import '../css/tree-view/init.less'

export default class Layout extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      data: [],
      selectedItem: null
    }
  }
  componentDidMount () {
    this.props.api.reply('data:changed', (data) => {
      this.setState({ data: data })
    })
  }
  getElements () {
    let elementsList = []
    const DocumentData = vcCake.getService('document')
    if (this.state.data) {
      elementsList = this.state.data.map((element) => {
        let data = DocumentData.children(element.id)
        return <Element
          element={element}
          data={data}
          key={element.id}
          level={1}
          api={this.props.api}
        />
      }, this)
    }
    return elementsList
  }

  getElementsOutput () {
    let elements = this.getElements()
    if (elements.length) {
      return (
        <ul className='vcv-ui-tree-layout'>
          {elements}
        </ul>
      )
    }
    return (
      <div className='vcv-ui-tree-layout-messages'>
        <p className='vcv-ui-tree-layout-message'>
          There are no elements on your canvas - start by adding element or template
        </p>
      </div>
    )
  }

  render () {
    return (
      <div className='vcv-ui-tree-layout-container'>
        {this.getElementsOutput()}
      </div>
    )
  }
}
