import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import lodash from 'lodash'
import FormTab from './tab'

export default class EditFormTabsOutput extends React.Component {
  static propTypes = {
    visibleTabs: React.PropTypes.array.isRequired,
    hiddenTabs: React.PropTypes.array.isRequired,
    activeTabIndex: React.PropTypes.number.isRequired,
    onTabsMount: React.PropTypes.func.isRequired,
    onTabsUnmount: React.PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.onTabsMount(this.refs[ 'editorTabsFreeSpace' ], {
      getDropdown: this.getDropdown
    })
  }

  componentWillUnmount () {
    this.props.onTabsUnmount(this.refs[ 'editorTabsFreeSpace' ], {
      getDropdown: this.getDropdown
    })
  }

  getDropdown = () => {
    return ReactDOM.findDOMNode(this.refs[ 'editorTabsDropdown' ])
  }
  getContainer = () => {
    return ReactDOM.findDOMNode(this.refs[ 'editorTabs' ])
  }

  render () {
    let { activeTabIndex } = this.props
    let visibleTabsHeaderOutput = []
    lodash.each(this.props.visibleTabs, (tab) => {
      visibleTabsHeaderOutput.push(
        <FormTab {...tab} {...this.props} getContainer={this.getContainer} />
      )
    })
    let hiddenTabsHeaderOutput = ''
    if (this.props.hiddenTabs.length) {
      let hiddenTabsHeader = []
      lodash.each(this.props.hiddenTabs, (tab) => {
        hiddenTabsHeader.push(
          <FormTab {...tab} {...this.props} getContainer={this.getContainer} />
        )
      })

      let dropdownClasses = classNames({
        'vcv-ui-editor-tab-dropdown': true,
        'vcv-ui-state--active': !!this.props.hiddenTabs.filter((tab) => {
          return tab.index === activeTabIndex
        }).length
      })
      hiddenTabsHeaderOutput = (
        <dl ref='editorTabsDropdown' className={dropdownClasses}>
          <dt className='vcv-ui-editor-tab-dropdown-trigger vcv-ui-editor-tab' title='More'>
            <span className='vcv-ui-editor-tab-content'>
              <i className='vcv-ui-editor-tab-icon vcv-ui-icon vcv-ui-icon-more-dots' />
            </span>
          </dt>
          <dd className='vcv-ui-editor-tab-dropdown-content'>
            {hiddenTabsHeader}
          </dd>
        </dl>
      )
    }

    return (
      <div className='vcv-ui-editor-tabs-container'>
        <nav ref='editorTabs' className='vcv-ui-editor-tabs'>
          {visibleTabsHeaderOutput}
          {hiddenTabsHeaderOutput}
          <span ref='editorTabsFreeSpace' className='vcv-ui-editor-tabs-free-space' />
        </nav>
      </div>
    )
  }
}
