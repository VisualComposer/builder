import React from 'react'
import classNames from 'classnames'

export default class ContentElementControl extends React.Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    element: React.PropTypes.string.isRequired
  }
  // constructor (props) {
  //   super(props)
  // }
  displayDescription () {
    let innerDoc = document.getElementById('vcv-editor-iframe').contentWindow.document
    innerDoc.querySelector('.vcv-blank-page-description-container').classList.add('vcv-blank-page-description-active')
  }
  hideDescription () {
    let innerDoc = document.getElementById('vcv-editor-iframe').contentWindow.document
    innerDoc.querySelector('.vcv-blank-page-description-container').classList.remove('vcv-blank-page-description-active')
  }
  render () {
    let controlClass = classNames([
      'vcv-ui-element-control',
      `vcv-ui-element-control--${this.props.element}`
    ])
    let source = `../../../../../../../sources/categories/icons/${this.props.name}.svg`
    return (
      <button
        className={controlClass}
        title={this.props.title}
        onMouseOver={this.displayDescription}
        onMouseOut={this.hideDescription}
      >
        <img className='vcv-ui-icon' src={source} alt={this.props.title} />
      </button>
    )
  }
}

