import React from 'react'
import classNames from 'classnames'

class StyleControlElement extends React.Component {
  state = {
    isActiveControl: false
  }

  handleClick () {
    console.log(this.props)
    // if (!this.state.isActiveControl) {
    //   this.setState({isActiveControl: true})
    // }
  }

  render () {
    let controlClass = classNames({
      'vcv-ui-style-control': true,
      'vcv-ui-style-control--active': this.state.isActiveControl
    })

    return (
      <button className={controlClass} onClick={this.handleClick.bind(this)}>
        {this.props.controlName}
      </button>
    )
  }
}
StyleControlElement.propTypes = {
  buttonIndex: React.PropTypes.number.isRequired
}

export default StyleControlElement
