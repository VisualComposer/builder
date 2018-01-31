import React from 'react'
import classNames from 'classnames'
import { getStorage } from 'vc-cake'

const workspaceStorage = getStorage('workspaceStorage')

export default class EditFormSection extends React.Component {
  section = null
  sectionHeader = null

  constructor (props) {
    super(props)
    this.state = {
      isActive: true,
      sectionDependenciesClasses: []
    }
    this.toggleSection = this.toggleSection.bind(this)
    this.setHeaderRef = this.setHeaderRef.bind(this)
  }

  componentDidUpdate (prevProps, prevState) {
    this.checkSectionPosition(prevState)
  }

  checkSectionPosition (prevState) {
    if (!this.sectionHeader) {
      return
    }
    const { isActive } = this.state
    const headerRect = this.sectionHeader.getBoundingClientRect()
    const headerOffset = this.sectionHeader.offsetTop + headerRect.height
    if (prevState && !prevState.isActive && isActive) {
      workspaceStorage.state('scrollbarSettings').set({ scroll: headerOffset - headerRect.height })
    }
  }

  setHeaderRef (header) {
    this.sectionHeader = header
  }

  toggleSection () {
    this.setState({ isActive: !this.state.isActive })
  }

  render () {
    let { isActive, sectionDependenciesClasses } = this.state
    let sectionClasses = classNames({
      'vcv-ui-edit-form-section': true,
      'vcv-ui-edit-form-section--opened': isActive,
      'vcv-ui-edit-form-section--closed': !isActive
    }, sectionDependenciesClasses)
    let { title, children } = this.props

    return (
      <div className={sectionClasses} ref='section'>
        <div
          className='vcv-ui-edit-form-section-header'
          onClick={this.toggleSection}
          ref={this.setHeaderRef}
        >
          {title}
        </div>
        <form className='vcv-ui-edit-form-section-content'>
          {children}
        </form>
      </div>
    )
  }
}
