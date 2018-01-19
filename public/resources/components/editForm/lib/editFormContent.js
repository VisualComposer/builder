import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import EditFormSection from './editFormSection'
import Scrollbar from '../../../scrollbar/scrollbar.js'

export default class EditFormContent extends React.Component {
  static propTypes = {
    element: PropTypes.object.isRequired,
    activeTab: PropTypes.object.isRequired,
    callFieldActivities: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      scrollbar: null
    }
    this.scrollBarMounted = this.scrollBarMounted.bind(this)
  }

  scrollBarMounted (scrollbar) {
    this.setState({ scrollbar: scrollbar })
  }

  getAccordionSections () {
    return this.props.allTabs.map((tab, index) => {
      return (
        <EditFormSection
          {...this.props}
          sectionContentScrollbar={this.state.scrollbar}
          key={tab.key}
          tab={tab}
        />
      )
    })
  }

  render () {
    let { activeTab } = this.props

    let plateClass = classNames({
      'vcv-ui-editor-plate': true,
      'vcv-ui-state--active': true
    }, `vcv-ui-editor-plate-${activeTab.key}`)

    return (
      <div className='vcv-ui-tree-content-section'>
        <Scrollbar ref={this.scrollBarMounted}>
          <div className='vcv-ui-tree-content-section-inner'>
            <div className='vcv-ui-editor-plates-container'>
              <div className='vcv-ui-editor-plates'>
                <div className='vcv-ui-editor-plate vcv-ui-state--active'>
                  <div className={plateClass}>
                    {this.getAccordionSections()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Scrollbar>
      </div>
    )
  }
}
