import React from 'react'
import PropTypes from 'prop-types'

export default class NavbarContent extends React.Component {
  static propTypes = {
    visibility: PropTypes.string,
    name: PropTypes.string
  }

  constructor (props) {
    super(props)
    this.state = {
      showDropdown: false
    }

    this.handleDropdownVisibility = this.handleDropdownVisibility.bind(this)
  }

  handleDropdownVisibility (e) {
    this.setState({
      showDropdown: e && e.type && e.type === 'mouseenter'
    })
  }

  render () {
    return null
  }
}
