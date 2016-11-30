import React from 'react'
import classNames from 'classnames'
import SearchTemplate from './searchTemplate'
import TemplateTab from './templateTab'
import Scrollbar from '../../../../../resources/scrollbar/scrollbar.js'
import SaveTemplate from './saveTemplate'
import MyTemplates from './myTemplates'
import HubTemplates from './hubTemplates'

export default class addTemplate extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    tabs: React.PropTypes.array
  }

  static defaultProps = {
    tabs: [
      {
        title: 'My Templates',
        index: 0,
        id: 'MyTemplates',
        component: <MyTemplates />
      },
      {
        title: 'Hub Templates',
        index: 1,
        id: 'HubTemplates',
        component: <HubTemplates />
      },
      {
        title: 'Save Template',
        index: 2,
        id: 'SaveTemplate',
        component: <SaveTemplate />
      }
    ]
  }

  constructor (props) {
    super(props)
    this.state = {
      activeTab: 0,
      templateName: ''
    }
    this.changeActiveTab = this.changeActiveTab.bind(this)
    this.handleSaveTemplate = this.handleSaveTemplate.bind(this)
  }

  getSearch () {
    return <SearchTemplate />
  }

  changeActiveTab (index) {
    this.setState({activeTab: index})
  }

  getTabsProps (tab) {
    return {
      key: `vcv${tab.id}`,
      title: tab.title,
      active: this.state.activeTab,
      index: tab.index,
      changeActive: this.changeActiveTab,
      changeActiveSave: this.changeActiveSave
    }
  }

  getTabs () {
    return this.props.tabs.map((tab) => {
      return <TemplateTab {...this.getTabsProps(tab)} />
    })
  }

  getContent () {
    return this.props.tabs[ this.state.activeTab ].component
  }

  handleSaveTemplate (e) {
    e && e.preventDefault()
  }

  render () {
    let footerClasses = classNames({
      'vcv-ui-tree-content-footer': true,
      'vcv-ui-state--hidden': this.state.activeTab !== 2
    })

    return (
      <div className='vcv-ui-tree-view-content vcv-ui-add-template-content'>
        <div className='vcv-ui-tree-content'>
          {this.getSearch()}
          <div className='vcv-ui-editor-tabs-container'>
            <nav className='vcv-ui-editor-tabs'>
              {this.getTabs()}
            </nav>
          </div>
          <div className='vcv-ui-tree-content-section'>
            <Scrollbar>
              <div className='vcv-ui-tree-content-section-inner'>
                <div className='vcv-ui-editor-plates-container'>
                  <div className='vcv-ui-editor-plates'>
                    {this.getContent()}
                  </div>
                </div>
              </div>
            </Scrollbar>
          </div>
          <div className={footerClasses}>
            <div className='vcv-ui-tree-layout-actions'>
              <a
                className='vcv-ui-tree-layout-action'
                href='#'
                title='Save'
                onClick={this.handleSaveTemplate}
              >
                <span className='vcv-ui-tree-layout-action-content'>
                  <i className='vcv-ui-tree-layout-action-icon vcv-ui-icon vcv-ui-icon-save' />
                  <span>Save</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
