import React from 'react'
import classNames from 'classnames'
import ContentStart from './contentParts/contentStart'
import ContentEnd from './contentParts/contentEnd'
import AddElementPanel from './addElement/addElementPanel'
import AddTemplatePanel from './addTemplate/AddTemplatePanel'
import TreeViewLayout from './treeView/treeViewLayout'
import SettingsPanel from './settings/settingsPanel'
import EditElementPanel from './editElement/editElementPanel'
import {getService} from 'vc-cake'

export default class PanelsContainer extends React.Component {
  static propTypes = {
    start: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node
    ]),
    end: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node
    ]),
    settings: React.PropTypes.object
  }

  getStartContent () {
    const { start } = this.props
    if (start === 'treeView') {
      return <TreeViewLayout />
    }
  }

  getEndContent () {
    const { end, settings } = this.props
    if (end === 'addElement') {
      return <AddElementPanel />
    } else if (end === 'addTemplate') {
      return <AddTemplatePanel />
    } else if (end === 'settings') {
      return <SettingsPanel />
    } else if (end === 'editElement') {
      if (settings && settings.element) {
        const cook = getService('cook')
        const cookElement = cook.get(settings.element)
        const activeTabId = settings.tag || ''
        return <EditElementPanel element={cookElement} activeTabId={activeTabId} />
      }
    }
  }

  render () {
    const { start, end } = this.props
    let layoutClasses = classNames({
      'vcv-layout-bar-content': true,
      'vcv-ui-state--visible': !!(start || end)
    })
    return (
      <div className={layoutClasses}>
        <ContentStart>
          {this.getStartContent()}
        </ContentStart>
        <ContentEnd>
          {this.getEndContent()}
        </ContentEnd>
      </div>
    )
  }
}
