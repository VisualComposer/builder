import React from 'react'
import PropTypes from 'prop-types'
import { getStorage, getService } from 'vc-cake'
import Element from './element'
import BlankRowPlaceholder from 'public/components/layoutHelpers/blankRowPlaceholder/component'

const workspaceStorage = getStorage('workspace')
const dataManager = getService('dataManager')
const roleManager = getService('roleManager')

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
    this.getBlankRowPlaceholder = this.getBlankRowPlaceholder.bind(this)
    this.layoutRef = React.createRef()
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
    if (data && data.addPanel && this.layoutRef.current && this.layoutRef.current.getAttribute('data-vcv-dnd-element')) {
      const body = this.layoutRef.current.closest('.vcwb')
      body.addEventListener('mouseup', this.handleBodyMouseUp)
    }
    if (data && !data.active && this.layoutRef.current && this.layoutRef.current.getAttribute('data-vcv-dnd-element')) {
      const body = this.layoutRef.current.closest('.vcwb')
      body.removeEventListener('mouseup', this.handleBodyMouseUp)
    }
  }

  /**
   * On body mouseup event end drag event
   * by setting workspaceStorage drag state to false.
   * setTimeout added to end drag after element is added and the Edit Form is opened.
   */
  handleBodyMouseUp () {
    setTimeout(() => {
      workspaceStorage.state('drag').set({ active: false })
    }, 0)
  }

  getBlankRowPlaceholder (iconColor) {
    return <BlankRowPlaceholder api={this.props.api} key='blank-row-placeholder' iconColor={iconColor} />
  }

  render () {
    const editorType = dataManager.get('editorType')
    const layoutsContent = []
    let elementsList
    const isAbleToAdd = roleManager.can('editor_content_element_add', roleManager.defaultTrue())
    if (this.props.data.length) {
      elementsList = this.props.data.map((element) => {
        return (
          <Element id={element.id} key={'element-wrapper-' + element.id} api={this.props.api} />
        )
      })
    }

    elementsList && layoutsContent.push(elementsList)
    if (editorType === 'footer' && isAbleToAdd) {
      layoutsContent.unshift(<BlankRowPlaceholder api={this.props.api} key='blank-row-placeholder' />)
    } else if (editorType !== 'popup' && isAbleToAdd) {
      layoutsContent.push(<BlankRowPlaceholder api={this.props.api} key='blank-row-placeholder' />)
    }

    return (
      <div
        className='vcv-layouts-html'
        data-vcv-module='content-layout'
        ref={this.layoutRef}
      >
        {layoutsContent}
      </div>
    )
  }
}
