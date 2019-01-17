import React from 'react'
import PropTypes from 'prop-types'
import { getStorage } from 'vc-cake'
import Element from './element'
import BlankRowPlaceholder from 'public/components/layoutHelpers/blankRowPlaceholder/component'

const workspaceStorage = getStorage('workspace')

export default class HtmlLayout extends React.Component {
  layout = null

  static propTypes = {
    data: PropTypes.array.isRequired,
    api: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.handleDragStateChage = this.handleDragStateChage.bind(this)
    this.handleBodyMouseUp = this.handleBodyMouseUp.bind(this)
  }

  componentDidMount () {
    workspaceStorage.state('drag').onChange(this.handleDragStateChage)
  }

  componentWillUnmount () {
    workspaceStorage.state('drag').ignoreChange(this.handleDragStateChage)
  }

  /**
   * When drag begins on a newly created page,
   * check if it starts from Add element panel and
   * if current component has proper DnD attribute.
   * Add/remove mouseup event for body tag.
   * @param data {object}
   */
  handleDragStateChage (data) {
    if (data && data.addPanel && !this.layout.getAttribute('data-vcv-dnd-element')) {
      const body = this.layout.closest('.vcwb')
      body.addEventListener('mouseup', this.handleBodyMouseUp)
    }
    if (data && !data.active && !this.layout.getAttribute('data-vcv-dnd-element')) {
      const body = this.layout.closest('.vcwb')
      body.removeEventListener('mouseup', this.handleBodyMouseUp)
    }
  }

  /**
   * On body mouseup event end drag event
   * by setting workspaceStorage drag state to false
   */
  handleBodyMouseUp () {
    workspaceStorage.state('drag').set({ active: false })
  }

  render () {
    const editorType = window.VCV_EDITOR_TYPE ? window.VCV_EDITOR_TYPE() : 'default'
    const layoutsContent = []
    let elementsList
    if (this.props.data) {
      elementsList = this.props.data.map((element) => {
        return (
          <Element element={element} key={element.id} api={this.props.api} />
        )
      })
    }

    elementsList && layoutsContent.push(elementsList)
    if (editorType === 'footer') {
      layoutsContent.unshift(<BlankRowPlaceholder api={this.props.api} key='blank-row-placeholder' />)
    } else {
      layoutsContent.push(<BlankRowPlaceholder api={this.props.api} key='blank-row-placeholder' />)
    }

    return (
      <div className='vcv-layouts-html'
        data-vcv-module='content-layout'
        ref={layout => (this.layout = layout)}
      >
        {layoutsContent}
      </div>
    )
  }
}
