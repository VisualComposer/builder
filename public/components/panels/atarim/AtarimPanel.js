import React from 'react'
import './style/sidebar.css'
import Scrollbar from 'public/components/scrollbar/scrollbar'
import classNames from 'classnames'
import { getStorage, getService } from 'vc-cake'
import innerAPI from 'public/components/api/innerAPI'

const workspaceContentState = getStorage('workspace').state('content')
const localizations = getService('dataManager').get('localizations')

export default class AtarimPanel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isVisible: workspaceContentState.get() === 'atarim'
    }

    this.setVisibility = this.setVisibility.bind(this)
  }

  async componentDidMount () {
    workspaceContentState.onChange(this.setVisibility)
  }

  componentWillUnmount () {
    workspaceContentState.ignoreChange(this.setVisibility)
  }

  setVisibility (activePanel) {
    this.setState({
      isVisible: activePanel === 'atarim'
    })
  }

  render () {
    const title = localizations ? localizations.atarimPanelTitle : 'Collaboration Tasks & Feedback'

    const panelClasses = classNames({
      'vcv-ui-tree-view-content': true,
      'vcv-ui-state--hidden': !this.state.isVisible
    })
    return (

      <div className={panelClasses}>
        <div className='vcv-ui-panel-heading'>
          <i className='vcv-ui-panel-heading-icon vcv-ui-icon vcv-ui-icon-atarim-comments' />
          <span className='vcv-ui-panel-heading-text'>
            {title}
          </span>
        </div>
        <div className='vcv-ui-tree-content-section'>
          <Scrollbar>
            {innerAPI.pick('panelAtarim', null)}
          </Scrollbar>
        </div>
      </div>

    )
  }
}
