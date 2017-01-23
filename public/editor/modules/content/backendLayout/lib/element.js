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
    activeElementId: React.PropTypes.string.isRequired
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
    let returnData = null
    const currentElement = cook.get(this.props.element) // optimize
    let elementsList = DocumentData.children(currentElement.get('id')).map((childElement) => {
      return <Element
        element={childElement}
        key={childElement.id}
        api={this.props.api}
        activeElementId={this.props.activeElementId}
        openElement={this.props.openElement}
      />
    })
    if (elementsList.length) {
      returnData = elementsList
    } else {
      returnData = currentElement.containerFor().length > 0
        ? <ContentControlsBackend api={this.props.api} id={currentElement.get('id')} /> : content
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
      api={this.props.api}
      element={this.props.element}
      activeElementId={this.props.activeElementId}
      openElement={this.props.openElement}
    />
  }

  render () {
    let el = cook.get(this.props.element)
    return this.getOutput(el)
  }
}
