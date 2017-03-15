import vcCake from 'vc-cake'
import React from 'react'
import DefaultElement from './defaultElement'

const cook = vcCake.getService('cook')
const DocumentData = vcCake.getService('document')

export default class Element extends React.Component {
  static propTypes = {
    element: React.PropTypes.object.isRequired,
    api: React.PropTypes.object.isRequired,
    layoutWidth: React.PropTypes.number.isRequired
  }

  // element (row/column) options to prevent applying of in the backend view
  elementOptions = ['columnGap', 'fullHeight', 'equalHeight', 'rowWidth', 'designOptionsAdvanced']

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

  componentDidUpdate () {
    this.props.api.notify('element:didUpdate', this.props.element.id)
  }

  getContent () {
    let { element, api, layoutWidth } = this.props
    const currentElement = cook.get(element)
    let elementsList = DocumentData.children(currentElement.get('id')).map((childElement) => {
      return <Element
        element={childElement}
        key={'vcvGetContentElement' + childElement.id}
        api={api}
        layoutWidth={layoutWidth}
      />
    })
    return elementsList.length ? elementsList : <vcvhelper className='vcv-empty-col-helper' />
  }

  visualizeAttributes (element) {
    let layoutAtts = {}
    let atts = element.getAll()
    Object.keys(atts).forEach((key) => {
      let findOption = this.elementOptions.find((option) => {
        return option === key
      })
      if (findOption) {
        layoutAtts[ key ] = element.settings(findOption).settings.value
      } else {
        layoutAtts[ key ] = atts[ key ]
      }
    })
    return layoutAtts
  }

  getOutput (el) {
    let { element, api, layoutWidth } = this.props
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
      layoutWidth={layoutWidth}
    />
  }

  render () {
    let el = cook.get(this.props.element)
    return this.getOutput(el)
  }
}
