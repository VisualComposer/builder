import React from 'react'
import ReactDOM from 'react-dom'

export default class wpbakeryModal extends React.Component {
  constructor (props) {
    super(props)
    this.el = document.createElement('div')
    this.el.className = 'vcv-wpbakery-edit-form-modal'
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
