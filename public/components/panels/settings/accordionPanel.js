import React from 'react'
import classNames from 'classnames'
import Tooltip from 'public/components/tooltip/tooltip'

export default class AccordionPanel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isActive: true
    }

    this.handleClickToggleSection = this.handleClickToggleSection.bind(this)
  }

  handleClickToggleSection (e) {
    if (e.currentTarget === e.target || (e.target && e.target.classList && e.target.classList.contains('vcv-ui-edit-form-section-header-title'))) {
      this.setState({ isActive: !this.state.isActive })
    }
  }

  render () {
    const { isActive } = this.state
    const { children, sectionTitle, tooltipText } = this.props

    const sectionClasses = classNames({
      'vcv-ui-edit-form-section': true,
      'vcv-ui-edit-form-section--opened': isActive,
      'vcv-ui-edit-form-section--closed': !isActive
    })

    let tooltip = null
    if (tooltipText) {
      tooltip = (
        <Tooltip>
          {tooltipText}
        </Tooltip>
      )
    }

    return (
      <div className={sectionClasses}>
        <div className='vcv-ui-edit-form-section-header' onClick={this.handleClickToggleSection}>
          <span className='vcv-ui-edit-form-section-header-title'>
            {sectionTitle}
          </span>
          {tooltip}
        </div>
        <div className='vcv-ui-edit-form-section-content'>
          {children}
        </div>
      </div>
    )
  }
}
