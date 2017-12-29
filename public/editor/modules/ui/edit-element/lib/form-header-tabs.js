import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import lodash from 'lodash'
import TabDependencies from './tab-dependencies'
import FormDropdown from './form-dropdown'
import PropTypes from 'prop-types'

export default class EditFormTabsOutput extends React.Component {
  static propTypes = {
    element: PropTypes.object.isRequired,
    allTabs: PropTypes.array.isRequired,
    activeTabIndex: PropTypes.number.isRequired,
    onTabsMount: PropTypes.func.isRequired,
    onTabsUnmount: PropTypes.func.isRequired,
    setFieldMount: PropTypes.func.isRequired,
    setFieldUnmount: PropTypes.func.isRequired
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

  getTabsWrapper = () => {
    return ReactDOM.findDOMNode(this.refs[ 'editorTabsWrapper' ])
  }

  getContainer = () => {
    return ReactDOM.findDOMNode(this.refs[ 'editorTabs' ])
  }

  render () {
    let { activeTabIndex, allTabs, setFieldMount, setFieldUnmount, element, showDropdown } = this.props
    let tabsHeaderOutput = []
    let formDropdown = ''
    let tabWrapperClasses = classNames({
      'vcv-ui-editor-tabs-wrapper': true,
      'vcv-ui-editor-tabs-wrapper-state--hidden': showDropdown
    })

    lodash.each(allTabs, (tab) => {
      tabsHeaderOutput.push(
        <TabDependencies
          {...tab}
          getContainer={this.getContainer}
          setFieldMount={setFieldMount}
          setFieldUnmount={setFieldUnmount}
          element={element}
          isActive={activeTabIndex === tab.index}
        />
      )
    })

    if (showDropdown) {
      formDropdown = (
        <FormDropdown
          activeTabIndex={activeTabIndex}
          allTabs={allTabs}
          setFieldMount={setFieldMount}
          setFieldUnmount={setFieldUnmount}
          getTabsWrapper={this.getTabsWrapper}
        />
      )
    }

    return (
      <div className='vcv-ui-editor-tabs-container'>
        <nav ref='editorTabs' className='vcv-ui-editor-tabs'>
          <div className={tabWrapperClasses} ref='editorTabsWrapper'>
            {tabsHeaderOutput}
          </div>
          {formDropdown}
          <span ref='editorTabsFreeSpace' className='vcv-ui-editor-tabs-free-space' />
        </nav>
      </div>
    )
  }
}
