import vcCake from 'vc-cake'
import React from 'react'

export default class DndHelper extends React.Component {
  static propTypes = {
    element: React.PropTypes.object.isRequired,
    api: React.PropTypes.object.isRequired
  }
  constructor (props) {
    super(props)
    this.state = {
      hover: false
    }
    this.checkHoverComponent = this.checkHoverComponent.bind(this)
  }
  checkHoverComponent (id) {
    if (this.props.element && this.props.element.get('id') === id) {
      this.setState({hover: true})
    }
  }
  componentDidMount () {
    vcCake.onDataChange('vcvLayoutHoverElement', this.checkHoverComponent)
  }
  componentWillUnmount () {
    vcCake.ignoreDataChange('vcvLayoutHoverElement', this.checkHoverComponent)
  }
  getContent () {
    if (this.state.hover === true) {
      return this.props.children
    }
    return this.props.children
  }
  render () {
    return this.getContent()
  }
}
