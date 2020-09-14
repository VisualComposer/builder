import React from 'react'
import classNames from 'classnames'
import addElementIcon from 'public/sources/images/blankRowPlaceholderIcons/addElement.raw'

export default class RowControl extends React.Component {
  static localizations = window.VCV_I18N && window.VCV_I18N()

  constructor (props) {
    super(props)
    this.state = {
      iconPosition: {}
    }
    this.handleMouseMovement = this.handleMouseMovement.bind(this)
    this.icon = React.createRef()
    this.container = React.createRef()
  }

  isElementInViewport (el) {
    const rect = el.getBoundingClientRect()

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }

  handleMouseMovement (e) {
    const isHelperVisible = this.isElementInViewport(this.icon.current)
    if (e.type === 'mouseenter' && !isHelperVisible) {
      const newState = {
        position: 'absolute'
      }
      const iconPosition = this.icon.current.getBoundingClientRect().top
      if (iconPosition < 0) {
        newState.bottom = `${(this.container.current.getBoundingClientRect().bottom / 2) - (this.icon.current.getBoundingClientRect().height / 2)}px`
      } else if (iconPosition > window.innerHeight) {
        newState.top = `${((window.innerHeight - this.container.current.getBoundingClientRect().top) / 2) - (this.icon.current.getBoundingClientRect().height / 2)}px`
      }
      this.setState({iconPosition: newState })
    } else {
      if (Object.keys(this.state.iconPosition).length) {
        // CSS animation to hide the icon is 0.2s, thus needs a timeout to remove styles
        const timeout = setTimeout(() => {
          this.setState({iconPosition: {} })
          clearTimeout(timeout)
        }, 200)
      }
    }
  }

  render () {
    const svgClasses = classNames({
      'vcv-ui-blank-row-element-control-icon': true
    })

    return (
      <span
        className='vcv-ui-blank-row-element-control'
        onMouseEnter={this.handleMouseMovement}
        onMouseLeave={this.handleMouseMovement}
        ref={this.container}
      >
        <span
          className={svgClasses}
          dangerouslySetInnerHTML={{ __html: addElementIcon }}
          title={RowControl.localizations ? RowControl.localizations.addElement : 'Add Element'}
          ref={this.icon}
          style={this.state.iconPosition}
        />
        <span className='vcv-ui-blank-row-element-control-label'>Add Element</span>
      </span>
    )
  }
}
