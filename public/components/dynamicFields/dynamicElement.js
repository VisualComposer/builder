import React from 'react'
import PropTypes from 'prop-types'

export default class DynamicElement extends React.Component {
  static propTypes = {
    cookApi: PropTypes.object.isRequired,
    cookElement: PropTypes.object.isRequired,
    element: PropTypes.object.isRequired,
    elementToRender: PropTypes.func.isRequired,
    elementProps: PropTypes.object.isRequired,
    inner: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props)
    this.elementComponentRef = React.createRef()
  }

  componentDidMount () {
    this.updateComments()
  }

  componentDidUpdate () {
    this.updateComments()
  }

  updateComments () {
    if (this.elementComponentRef && this.elementComponentRef.current) {
      this.props.cookApi.dynamicFields.updateDynamicComments(this.elementComponentRef.current, this.props.element.id, this.props.cookElement, this.props.inner)
    }
  }

  render () {
    return React.createElement(this.props.elementToRender, {
      ref: this.elementComponentRef,
      ...this.props.elementProps
    })
  }
}
