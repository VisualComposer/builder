import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Field from './field'
import EditFormReplaceElement from './editFormReplaceElement'
import PresetSection from './presetSection'

export default class EditFormSection extends React.Component {
  static propTypes = {
    tab: PropTypes.object.isRequired,
    onAttributeChange: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      isActive: true,
      dependenciesClasses: []
    }
    this.handleClickToggleSection = this.handleClickToggleSection.bind(this)
  }

  componentDidMount () {
    if (this.props.tab.index === this.props.activeTabIndex) {
      window.setTimeout(() => {
        this.checkSectionPosition()
      }, 0)
    }

    if (this.props.setFieldMount) {
      this.props.setFieldMount(this.props.tab.fieldKey, {
        refWrapperComponent: this,
        refWrapper: this.section
      }, 'section')
    }
  }

  componentDidUpdate (prevProps, prevState) {
    window.setTimeout(() => {
      this.checkSectionPosition(prevState)
    }, 0)
  }

  componentWillUnmount () {
    if (this.props.setFieldUnmount) {
      this.props.setFieldUnmount(this.props.tab.fieldKey, 'section')
    }
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
      const scrollbar = this.props.getSectionContentScrollbar()
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
  handleClickToggleSection () {
    this.setState({ isActive: !this.state.isActive })
  }

  /**
   * Get section form fields
   * @param tabParams
   * @return Array
   */
  getSectionFormFields (tabParams) {
    return tabParams.map((param) => {
      let fieldType = param.data && param.data.type ? param.data.type.name : ''
      if (this.props.options.nestedAttr) {
        fieldType = param.data.type
      }
      const fieldOptions = this.checkContainerDependency(param)
      if (fieldOptions && fieldOptions.hide) {
        return null
      }
      const removeDependencies = fieldOptions && fieldOptions.removeDependencies

      return (
        <Field
          {...this.props}
          key={`edit-form-field-${param.key}`}
          fieldKey={param.key}
          fieldType={fieldType}
          removeDependencies={removeDependencies}
        />
      )
    })
  }

  checkContainerDependency (param) {
    const options = param.data && param.data.settings && param.data.settings.options
    const containerDependency = options && options.containerDependency
    const opts = {}

    if (containerDependency) {
      const editorType = window.VCV_EDITOR_TYPE ? window.VCV_EDITOR_TYPE() : 'default'

      Object.keys(containerDependency).forEach((key) => {
        const action = containerDependency[key]
        if (editorType === key) {
          opts[action] = true
        }
      })
    }

    return opts
  }

  render () {
    const { tab, sectionIndex, isPreset } = this.props
    const { isActive, dependenciesClasses } = this.state
    const sectionClasses = classNames({
      'vcv-ui-edit-form-section': true,
      'vcv-ui-edit-form-section--opened': isActive,
      'vcv-ui-edit-form-section--closed': !isActive
    }, dependenciesClasses)

    let tabTitle
    if (this.props.options && this.props.options.nestedAttr) {
      tabTitle = tab.data.options.label || tab.data.options.tabLabel
    } else {
      tabTitle = tab.data.settings.options.label ? tab.data.settings.options.label : tab.data.settings.options.tabLabel
    }
    let replaceElement = null

    if (sectionIndex === 0) {
      let disableReplaceable = false
      if (this.props.options && this.props.options.nestedAttr) {
        disableReplaceable = tab.data.options.disableReplaceable
      } else {
        disableReplaceable = tab.data.settings.options.disableReplaceable
      }

      if (!disableReplaceable) {
        replaceElement = (
          <EditFormReplaceElement {...this.props} />
        )
      }
    }

    return (
      <div className={sectionClasses} key={tab.key} ref={ref => { this.section = ref }}>
        <div
          className='vcv-ui-edit-form-section-header' onClick={this.handleClickToggleSection}
          ref={header => { this.sectionHeader = header }}
        >
          {tabTitle}
        </div>
        <form className='vcv-ui-edit-form-section-content'>
          {isPreset ? (
            <PresetSection />
          ) : (
            <>
              {replaceElement}
              {this.getSectionFormFields(tab.params)}
            </>
          )}
        </form>
      </div>
    )
  }
}
