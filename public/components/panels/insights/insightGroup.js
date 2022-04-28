import React from 'react'
import classNames from 'classnames'
import { getStorage, env } from 'vc-cake'

const workspaceStorage = getStorage('workspace')

export default class InsightsGroup extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      expanded: false
    }

    this.handleToggleExpand = this.handleToggleExpand.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
  }

  handleMouseEnter (domNodeSelector) {
    if (domNodeSelector) {
      workspaceStorage.state('userInteractWith').set(false, domNodeSelector)
    }
  }

  handleMouseLeave () {
    workspaceStorage.state('userInteractWith').set(false)
  }

  getInsightItems (items) {
    return items.map((item, index) => {
      let goToButton = null
      if (item.elementID) {
        goToButton = (
          <button
            onClick={this.handleGoToElement.bind(this, item.elementID)}
            className='vcv-insight-go-to-action vcv-ui-icon vcv-ui-icon-edit'
          />
        )
      }
      const itemClasses = classNames({
        'vcv-insight-item': true,
        'vcv-insight-item--grouped': item.groupedItems
      })

      return (
        <div
          className={itemClasses}
          key={`insights-item-${item.type}-${index}`}
          onMouseOver={() => {
            this.handleMouseEnter(item.domNodeSelector)
          }}
          onMouseLeave={this.handleMouseLeave}
        >
          {item.thumbnail && (
            <img className='vcv-insight-item-thumbnail' src={item.thumbnail} alt='thumbnail' />
          )}
          <span className='vcv-insight-item-description' dangerouslySetInnerHTML={{ __html: item.description }} />
          {goToButton}
        </div>
      )
    })
  }

  handleGoToElement (elementID) {
    const iframe = env('iframe')
    const editorEl = iframe.document.querySelector(`#el-${elementID}`)
    workspaceStorage.trigger('edit', elementID, '')
    const scrollTimeout = setTimeout(() => {
      editorEl.scrollIntoView({ behavior: 'smooth' })
      clearTimeout(scrollTimeout)
    }, 150)
  }

  handleToggleExpand () {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render () {
    const { insightGroup, type } = this.props

    const filteredItems = insightGroup.items.filter(item => !!item.description)

    let collapseButton = null
    if (filteredItems.length) {
      const expandClasses = classNames({
        'vcv-ui-icon': true,
        'vcv-ui-icon-expand': !this.state.expanded,
        'vcv-ui-icon-arrow-up': this.state.expanded,
        'vcv-insight-collapse-button': true
      })
      collapseButton = (
        <button
          onClick={this.handleToggleExpand}
          className={expandClasses}
        />
      )
    } else if (insightGroup.items.length === 1 && insightGroup.items[0].loading) {
      collapseButton = <span className='vcv-ui-wp-spinner' />
    }

    return (
      <div className={`vcv-insight vcv-ui-form-group vcv-insight-${insightGroup.state} vcv-insights-group-${type}`} key={`insights-group-${type}`}>
        <div className='vcv-insight-header'>
          <span className='vcv-insight-title'>{insightGroup.title}</span>
          <span className='vcv-insight-description' dangerouslySetInnerHTML={{ __html: insightGroup.description }} />
          {collapseButton}
        </div>
        {filteredItems.length && this.state.expanded ? (
          <div className='vcv-insight-items'>
            {this.getInsightItems(filteredItems)}
          </div>
        ) : null}
      </div>
    )
  }
}
