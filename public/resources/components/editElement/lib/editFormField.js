import React from 'react'
import classNames from 'classnames'
import FieldDependencyManager from './fieldDependencyManager'

export default class EditFormField extends React.Component {
  static propTypes = {
    tab: React.PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      isActive: false
    }
    this.field = this.field.bind(this)
    this.toggleField = this.toggleField.bind(this)
  }

  componentDidMount () {
    // console.log('componentDidMount props', this.props)
    if (!this.props.tab.index) {
      this.toggleField()
    }
  }

  toggleField () {
    this.setState({ isActive: !this.state.isActive })
  }

  field (field) {
    return (
      <FieldDependencyManager
        {...this.props}
        key={`edit-form-field-${field.key}`}
        fieldKey={field.key}
        updater={this.props.onElementChange}
      />
    )
  }

  render () {
    let { tab } = this.props
    let { isActive } = this.state
    let fieldsClass = classNames({
      'vcv-ui-editor-form-fields': true,
      'vcv-ui-editor-form-fields--visible': isActive
    })
    let fieldsStyle = {
      display: isActive ? 'block' : 'none'
    }
    // console.log('tab', tab)
    // console.log('tab.data.settings.options.label', tab.data.settings.options.label)
    // console.log('tab.data.settings.options', tab.data.settings.options)
    // console.log('editFormFieldsForm props', this.props)
    let tabTitle = tab.data.settings.options.label ? tab.data.settings.options.label : tab.data.settings.options.tabLabel
    // console.log('tabTitle', tabTitle)
    return <div className='vcv-ui-editor-form-field' key={tab.key}>
      <div
        style={{padding: '10px', background: '#2b4b80', color: '#fff', cursor: 'pointer'}}
        onClick={this.toggleField}
      >
        {tabTitle}
      </div>
      <div className={fieldsClass} style={fieldsStyle}>{tab.params.map(this.field)}</div>
    </div>
  }
}
