import React from 'react'
import SearchTemplate from './searchTemplate'
import TemplateTab from './templateTab'
import Scrollbar from '../../../../../resources/scrollbar/scrollbar.js'

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
        id: 'MyTemplates'
      },
      {
        title: 'Hub Templates',
        index: 1,
        id: 'HubTemplates'
      },
      {
        title: 'Save Template',
        index: 2,
        id: 'SaveTemplate'
      }
    ]
  }

  constructor (props) {
    super(props)
    this.state = {
      activeTab: 0
    }
    this.changeActiveTab = this.changeActiveTab.bind(this)
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
      changeActive: this.changeActiveTab
    }
  }

  getTabs () {
    return this.props.tabs.map((tab) => {
      return <TemplateTab {...this.getTabsProps(tab)} />
    })
  }

  getContent () {
    return <div>Content</div>
  }

  render () {
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
        </div>
      </div>
    )
  }
}
