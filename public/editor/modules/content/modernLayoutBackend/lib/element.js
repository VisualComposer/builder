import vcCake from 'vc-cake'
import React from 'react'
import DefaultElement from './defaultElement'
import ContentControls from '../../../../../resources/components/layoutHelpers/contentControls/component'

const cook = vcCake.getService('cook')
const DocumentData = vcCake.getService('document')
const elementsStorage = vcCake.getStorage('elements')
const assetsStorage = vcCake.getStorage('assets')

export default class Element extends React.Component {
  static propTypes = {
    element: React.PropTypes.object.isRequired,
    api: React.PropTypes.object.isRequired,
    layoutWidth: React.PropTypes.number.isRequired
  }

  // element (row/column) options to prevent applying of in the backend view
  elementOptions = ['columnGap', 'fullHeight', 'equalHeight', 'rowWidth', 'designOptionsAdvanced']

  constructor (props) {
    super(props)
    this.state = {
      element: props.element
    }
    this.dataUpdate = this.dataUpdate.bind(this)
  }

  componentDidMount () {
    this.props.api.notify('element:mount', this.props.element.id)
    elementsStorage.state('element:' + this.state.element.id).onChange(this.dataUpdate)
    assetsStorage.trigger('addElement', this.state.element.id)
    // rename row/column id to prevent applying of DO
    let element = document.querySelector(`#el-${this.props.element.id}`)
    if (element) {
      element.id = `el-${this.props.element.id}-temp`
    }
  }

  componentWillUnmount () {
    this.props.api.notify('element:unmount', this.props.element.id)
    elementsStorage.state('element:' + this.state.element.id).ignoreChange(this.dataUpdate)
    assetsStorage.trigger('removeElement', this.state.element.id)
    let element = document.querySelector(`#el-${this.props.element.id}-temp`)
    if (element) {
      element.id = `el-${this.props.element.id}`
    }
  }

  componentDidUpdate () {
    this.props.api.notify('element:didUpdate', this.props.element.id)
  }

  dataUpdate (data) {
    this.setState({element: data || this.props.element})
    assetsStorage.trigger('updateElement', this.state.element.id)
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
    return elementsList.length ? elementsList : <ContentControls api={api} id={currentElement.get('id')} />
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
    if (!el) {
      return null
    }
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
