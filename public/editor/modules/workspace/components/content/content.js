import React from 'react'
import classNames from 'classnames'
import ContentStart from './contentStart'
import ContentEnd from './contentEnd'
import AddElementPanel from '../addElement/addElementPanel'
import AddTemplatePanel from '../addTemplate/AddTemplatePanel'
import TreeViewLayout from '../treeView/treeViewLayout'
export default class Content extends React.Component {
  static propTypes = {
    start: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node
    ]),
    end: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node
    ])
  }

  getStartContent () {
    const { start } = this.props
    if (start === 'treeView') {
      return <TreeViewLayout />
    }
  }

  getEndContent () {
    const { end } = this.props
    if (end === 'addElement') {
      return <AddElementPanel />
    } else if (end === 'addTemplate') {
      return <AddTemplatePanel />
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
