import vcCake from 'vc-cake'
import React from 'react'
import DefaultElement from './defaultElement'
import ContentControlsBackend from './helpers/contentControlsBackend/component'

const cook = vcCake.getService('cook')
const DocumentData = vcCake.getService('document')

export default class Element extends React.Component {
  static propTypes = {
    element: React.PropTypes.object.isRequired,
    api: React.PropTypes.object.isRequired,
    openElement: React.PropTypes.func.isRequired,
    activeElementId: React.PropTypes.string.isRequired,
    layout: React.PropTypes.object.isRequired,
    layoutWidth: React.PropTypes.object.isRequired
  }

  componentDidMount () {
    this.props.api.notify('element:mount', this.props.element.id)
    // rename row/column id to prevent applying of DO
    let element = document.querySelector(`#el-${this.props.element.id}`)
    if (element) {
      element.id = `el-${this.props.element.id}-temp`
    }
  }

  componentWillUnmount () {
    this.props.api.notify('element:unmount', this.props.element.id)
    let element = document.querySelector(`#el-${this.props.element.id}-temp`)
    if (element) {
      element.id = `el-${this.props.element.id}`
    }
  }

  getContent (content) {
    let { element, api, activeElementId, openElement, layout, layoutWidth } = this.props
    let returnData = null
    const currentElement = cook.get(element)
    let elementsList = DocumentData.children(currentElement.get('id')).map((childElement) => {
      return <Element
        element={childElement}
        key={'vcvGetContentElement' + childElement.id}
        api={api}
        activeElementId={activeElementId}
        openElement={openElement}
        layout={layout}
        layoutWidth={layoutWidth}
      />
    })
    if (elementsList.length) {
      returnData = elementsList
    } else {
      returnData = currentElement.containerFor().length > 0
        ? <ContentControlsBackend api={api} id={currentElement.get('id')} /> : content
    }
    return returnData
  }

  visualizeAttributes (element) {
    let layoutAtts = {}
    let atts = element.getAll()
    Object.keys(atts).forEach((key) => {
      layoutAtts[ key ] = atts[ key ]
    })
    return layoutAtts
  }

  getOutput (el) {
    let { element, api, activeElementId, openElement, layout, layoutWidth } = this.props
    let id = el.get('id')
    let ContentComponent = el.getContentComponent()
    if (!ContentComponent) {
      return null
    }
    let editor = {
      'data-vcv-element': id
    }
    if (el.get('metaDisableInteractionInEditor')) {
      editor['data-vcv-element-disable-interaction'] = true
    }

    if (el.get('backendView') === 'frontend') {
      return <ContentComponent
        id={id}
        key={'vcvLayoutContentComponent' + id}
        atts={this.visualizeAttributes(el)}
        editor={editor}
      >
        {this.getContent()}
      </ContentComponent>
    }
    return <DefaultElement
      key={'vcvLayoutDefaultElement' + id}
      api={api}
      element={element}
      activeElementId={activeElementId}
      openElement={openElement}
      layout={layout}
      layoutWidth={layoutWidth}
    />
  }

  render () {
    let el = cook.get(this.props.element)
    return this.getOutput(el)
  }
}
