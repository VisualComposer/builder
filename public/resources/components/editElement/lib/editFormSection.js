import React from 'react'
import classNames from 'classnames'
import FieldDependencyManager from './fieldDependencyManager'
import PropTypes from 'prop-types'

export default class EditFormSection extends React.Component {
  static propTypes = {
    tab: PropTypes.object.isRequired
  }

  section = null
  sectionHeader = null
  timeout = null

  constructor (props) {
    super(props)
    this.state = {
      isActive: true,
      sectionDependenciesClasses: [],
      contentEnd: document.getElementById('vcv-editor-end')
    }
    this.toggleSection = this.toggleSection.bind(this)
  }

  componentDidMount () {
    if (this.props.tab.index === this.props.activeTabIndex) {
      this.checkSectionPosition()
    }

    this.props.setFieldMount(this.props.tab.fieldKey, {
      ref: this.refs[ 'section' ],
      refComponent: this,
      refDomComponent: this.refs[ 'section' ]
    }, 'section')
  }

  componentDidUpdate (prevProps, prevState) {
    this.checkSectionPosition(prevState)
  }

  componentWillUnmount () {
    this.props.setFieldUnmount(this.props.tab.fieldKey, 'section')
  }

  /**
   * Set workspace storage state to scroll edit form if section content is below the fold
   */
  checkSectionPosition (prevState) {
    const { isActive } = this.state
    if (prevState && !prevState.isActive && isActive || this.props.tab.index === this.props.activeTabIndex) {
      // will scroll to top
      let scrollbar = this.props.sectionContentScrollbar
      if (scrollbar) {
        if (this.timeout) {
          window.clearTimeout(this.timeout)
          this.timeout = null
        }
        this.timeout = window.setTimeout(() => {
          const headerRect = this.sectionHeader.getBoundingClientRect()
          const headerOffset = this.sectionHeader.offsetTop + headerRect.height
          const offset = headerOffset - headerRect.height
          scrollbar.scrollTop(offset)
          this.timeout = null
        }, 10)
      }
    }
  }

  /**
   * Toggle section
   */
  toggleSection () {
    this.setState({ isActive: !this.state.isActive })
  }

  /**
   * Get section form fields
   * @param tabParams
   * @return Array
   */
  getSectionFormFields (tabParams) {
    return tabParams.map((param) => {
      return <FieldDependencyManager
        {...this.props}
        key={`edit-form-field-${param.key}`}
        fieldKey={param.key}
        updater={this.props.onElementChange}
        // updateDependencies={this.updateDependencyClasses}
      />
    })
  }

  render () {
    let { tab } = this.props
    let { isActive, sectionDependenciesClasses } = this.state
    let sectionClasses = classNames({
      'vcv-ui-edit-form-section': true,
      'vcv-ui-edit-form-section--opened': isActive,
      'vcv-ui-edit-form-section--closed': !isActive
    }, sectionDependenciesClasses)
    let tabTitle = tab.data.settings.options.label ? tab.data.settings.options.label : tab.data.settings.options.tabLabel

    return <div
      className={sectionClasses}
      key={tab.key}
      ref='section'
    >
      <div
        className='vcv-ui-edit-form-section-header'
        onClick={this.toggleSection}
        ref={(header) => { this.sectionHeader = header }}
      >
        {tabTitle}
      </div>
      <form className='vcv-ui-edit-form-section-content'>
        {this.getSectionFormFields(tab.params)}
      </form>
    </div>
  }
}
