import React from 'react'
import ReactDOM from 'react-dom'

/* Working prototype */
export default class GutenbergModal extends React.Component {
  constructor (props) {
    super(props)
    this.el = document.createElement('div')
    this.el.className = 'vcv-gutenberg-modal'
  }

  componentDidMount () {
    const modalRoot = document.querySelector('.vcv-layout-container')
    modalRoot.appendChild(this.el)
  }

  componentWillUnmount () {
    const modalRoot = document.querySelector('.vcv-layout-container')
    modalRoot.removeChild(this.el)
  }

  render () {
    return ReactDOM.createPortal(
      this.props.children,
      this.el
    )
  }
}
