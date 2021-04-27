import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default class TemplatesGroup extends React.Component {
  static propTypes = {
    groupData: PropTypes.object,
    onGroupToggle: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      isOpened: props.isOpened
    }

    this.handleGroupToggle = this.handleGroupToggle.bind(this)
  }

  handleGroupToggle () {
    this.setState({
      isOpened: !this.state.isOpened
    })
    this.props.onGroupToggle(this.props.groupData.id, !this.state.isOpened)
  }

  render () {
    const { groupData, children } = this.props
    const expandClasses = classNames({
      'vcv-ui-icon': true,
      'vcv-ui-icon-expand': !this.state.isOpened,
      'vcv-ui-icon-arrow-up': true,
      'vcv-element-categories-expand-button': true
    })

    return (
      <div className='vcv-element-category-items'>
        <div className='vcv-element-category-title-wrapper'>
          <span
            className='vcv-element-category-title'
            onClick={this.handleGroupToggle}
          >
            {groupData.title}
          </span>
          <button
            onClick={this.handleGroupToggle}
            className={expandClasses}
            tabIndex='-1'
          />
        </div>
        {this.state.isOpened && children}
      </div>
    )
  }
}
