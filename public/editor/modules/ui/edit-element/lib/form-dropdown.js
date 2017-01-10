import React from 'react'

export default class FormDropdown extends React.Component {
  static propTypes = {
    activeTabIndex: React.PropTypes.number.isRequired,
    allTabs: React.PropTypes.array.isRequired,
    getTabsWrapper: React.PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      selectValue: this.props.activeTabIndex,
      maxWidth: null
    }
    this.handleSelectChange = this.handleSelectChange.bind(this)
  }

  componentDidMount () {
    this.setMaxWidth()
  }

  componentWillReceiveProps (nextProps) {
    this.setSelectValue(nextProps.activeTabIndex)
  }

  setMaxWidth () {
    let maxWidth = this.props.getTabsWrapper().offsetWidth
    this.setState({
      maxWidth: maxWidth
    })
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
    let customProps = {}
    customProps.style = {
      maxWidth: this.state.maxWidth
    }

    let { allTabs } = this.props
    let options = []
    allTabs.forEach((tab) => {
      let title = tab.data.settings.options.tabLabel || tab.data.settings.options.label
      options.push(<option key={tab.key} value={tab.index}>{title}</option>)
    })

    return (
      <select
        className='vcv-ui-form-dropdown vcv-ui-editors-header-dropdown'
        value={this.state.selectValue}
        onChange={this.handleSelectChange}
        {...customProps}
      >
        {options}
      </select>
    )
  }
}
