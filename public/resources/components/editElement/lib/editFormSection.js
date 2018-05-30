import React from 'react'
import classNames from 'classnames'
import FieldDependencyManager from './fieldDependencyManager'
import PropTypes from 'prop-types'
import EditFormReplaceElement from './editFormReplaceElement'

export default class EditFormSection extends React.Component {
  static propTypes = {
    tab: PropTypes.object.isRequired
  }

  section = null
  sectionHeader = null

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
      window.setTimeout(() => {
        this.checkSectionPosition()
      }, 0)
    }

    this.props.setFieldMount(this.props.tab.fieldKey, {
      ref: this.refs[ 'section' ],
      refComponent: this,
      refDomComponent: this.refs[ 'section' ]
    }, 'section')
  }

  componentDidUpdate (prevProps, prevState) {
    window.setTimeout(() => {
      this.checkSectionPosition(prevState)
    }, 0)
  }

  componentWillUnmount () {
    this.props.setFieldUnmount(this.props.tab.fieldKey, 'section')
  }

  /**
   * Set workspace storage state to scroll edit form if section content is below the fold
   */
  checkSectionPosition (prevState) {
    if (!this.sectionHeader) {
      return
    }
    const { isActive } = this.state
    if ((prevState && !prevState.isActive && isActive) || this.props.tab.index === this.props.activeTabIndex) {
      // will scroll to top
      let scrollbar = this.props.sectionContentScrollbar
      if (scrollbar) {
        const headerRect = this.sectionHeader.getBoundingClientRect()
        const headerOffset = this.sectionHeader.offsetTop + headerRect.height
        const offset = headerOffset - headerRect.height
        scrollbar.scrollTop(offset)
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
      const fieldType = param.data && param.data.type ? param.data.type.name : ''
      const fieldOptions = this.checkContainerDependency(param)
      if (fieldOptions && fieldOptions.hide) {
        return null
      }
      const removeDependencies = fieldOptions && fieldOptions.removeDependencies

      return <FieldDependencyManager
        {...this.props}
        key={`edit-form-field-${param.key}`}
        fieldKey={param.key}
        updater={this.props.onElementChange}
        fieldType={fieldType}
        removeDependencies={removeDependencies}
        // updateDependencies={this.updateDependencyClasses}
      />
    })
  }

  checkContainerDependency (param) {
    const options = param.data && param.data.settings && param.data.settings.options
    const containerDependency = options && options.containerDependency
    let opts = {}

    if (containerDependency) {
      const editorType = window.VCV_EDITOR_TYPE ? window.VCV_EDITOR_TYPE() : 'default'

      Object.keys(containerDependency).forEach((key) => {
        const action = containerDependency[ key ]
        if (editorType === key) {
          opts[ action ] = true
        }
      })
    }

    return opts
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

    let replaceElement = null

    if (tab.fieldKey === 'editFormTab1') {
      replaceElement = (
        <EditFormReplaceElement {...this.props} />
      )
    }

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
        {replaceElement}
        {this.getSectionFormFields(tab.params)}
      </form>
    </div>
  }
}
