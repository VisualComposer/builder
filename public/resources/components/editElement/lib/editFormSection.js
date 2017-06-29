import React from 'react'
import classNames from 'classnames'
import FieldDependencyManager from './fieldDependencyManager'

export default class EditFormSection extends React.Component {
  static propTypes = {
    tab: React.PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      isActive: false
    }
    this.getSectionFormFields = this.getSectionFormFields.bind(this)
    this.toggleSection = this.toggleSection.bind(this)
  }

  componentDidMount () {
    if (!this.props.tab.index) {
      this.toggleSection()
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
      />
    })
  }

  render () {
    let { tab } = this.props
    let { isActive } = this.state
    let sectionClasses = classNames({
      'vcv-ui-edit-form-section': true,
      'vcv-ui-edit-form-section--opened': isActive,
      'vcv-ui-edit-form-section--closed': !isActive,
    })
    let tabTitle = tab.data.settings.options.label ? tab.data.settings.options.label : tab.data.settings.options.tabLabel

    return <div className={sectionClasses} key={tab.key}>
      <div className='vcv-ui-edit-form-section-header' onClick={this.toggleSection}>
        {tabTitle}
      </div>
      <div className='vcv-ui-edit-form-section-content'>
        {this.getSectionFormFields(tab.params)}
      </div>
    </div>
  }
}
