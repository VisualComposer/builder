import React from 'react'
import FormDropdownOption from './formDropdownOption'

export default class FormDropdown extends React.Component {
  static propTypes = {
    activeTabIndex: React.PropTypes.number.isRequired,
    allTabs: React.PropTypes.array.isRequired,
    setFieldMount: React.PropTypes.func.isRequired,
    setFieldUnmount: React.PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      selectValue: this.props.activeTabIndex
    }
    this.handleSelectChange = this.handleSelectChange.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    this.setSelectValue(nextProps.activeTabIndex)
  }

  handleSelectChange (e) {
    let selectValue = e.currentTarget.value
    this.setSelectValue(selectValue)
    this.props.allTabs[ selectValue ].changeTab(selectValue)
  }

  setSelectValue (selectValue) {
    this.setState({ selectValue })
  }

  render () {
    let { allTabs } = this.props
    let options = []
    allTabs.forEach((tab) => {
      options.push(<FormDropdownOption
        setFieldMount={this.props.setFieldMount}
        setFieldUnmount={this.props.setFieldUnmount}
        key={tab.key}
        tab={tab}
      />)
    })

    return (
      <select
        className='vcv-ui-form-dropdown vcv-ui-editors-header-dropdown'
        value={this.state.selectValue}
        onChange={this.handleSelectChange}
      >
        {options}
      </select>
    )
  }
}
