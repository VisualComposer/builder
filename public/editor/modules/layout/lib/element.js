import vcCake from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import ContentControls from 'public/components/layoutHelpers/contentControls/component'
import ContentEditableComponent from 'public/components/layoutHelpers/contentEditable/contentEditableComponent'
import ColumnResizer from 'public/components/columnResizer/columnResizer'
import MobileDetect from 'mobile-detect'
import { isEqual } from 'lodash'
import PropTypes from 'prop-types'

const elementsStorage = vcCake.getStorage('elements')
const assetsStorage = vcCake.getStorage('assets')
const cook = vcCake.getService('cook')
const DocumentData = vcCake.getService('document')
const { getBlockRegexp } = vcCake.getService('utils')
const blockRegexp = getBlockRegexp()

const {
  getDynamicFieldsData,
  updateDynamicComments,
  cleanComments
} = cook.dynamicFields

export default class Element extends React.Component {
  static propTypes = {
    element: PropTypes.object.isRequired,
    api: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.dataUpdate = this.dataUpdate.bind(this)
    this.cssJobsUpdate = this.cssJobsUpdate.bind(this)
    this.elementComponentTransformation = this.elementComponentTransformation.bind(this)
    this.elementComponentRef = React.createRef()
    this.state = {
      element: props.element,
      cssBuildingProcess: true,
      isRendered: false
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!isEqual(this.state.element, nextProps.element)) {
      assetsStorage.trigger('updateElement', this.state.element.id)
    }
    this.setState({ element: nextProps.element })
  }

  componentDidMount () {
    this.props.api.notify('element:mount', this.state.element.id)
    elementsStorage.on(`element:${this.state.element.id}`, this.dataUpdate)
    assetsStorage.state('jobs').onChange(this.cssJobsUpdate)
    assetsStorage.trigger('addElement', this.state.element.id)
    elementsStorage.state('elementComponentTransformation').onChange(this.elementComponentTransformation)
    if (this.elementComponentRef && this.elementComponentRef.current) {
      let cookElement = cook.get(this.state.element)
      updateDynamicComments(this.elementComponentRef.current, this.state.element.id, cookElement)
    }
  }

  componentWillUnmount () {
    this.props.api.notify('element:unmount', this.state.element.id)
    elementsStorage.off(`element:${this.state.element.id}`, this.dataUpdate)
    assetsStorage.state('jobs').ignoreChange(this.cssJobsUpdate)
    assetsStorage.trigger('removeElement', this.state.element.id)
    elementsStorage.state('elementComponentTransformation').ignoreChange(this.elementComponentTransformation)
    // Clean everything before/after
    if (!this.elementComponentRef || !this.elementComponentRef.current) {
      return
    }
    const el = ReactDOM.findDOMNode(this.elementComponentRef.current)
    cleanComments(el, this.state.element.id)
  }

  componentDidUpdate () {
    this.props.api.notify('element:didUpdate', this.props.element.id)
    if (this.elementComponentRef && this.elementComponentRef.current) {
      let cookElement = cook.get(this.state.element)
      updateDynamicComments(this.elementComponentRef.current, this.state.element.id, cookElement)
    }
  }

  dataUpdate (data, source, options) {
    const { disableUpdateAssets, disableUpdateComponent } = options || {}
    if (disableUpdateComponent !== true) {
      this.setState({ element: data || this.props.element })
    }
    if (disableUpdateAssets !== true) {
      assetsStorage.trigger('updateElement', this.state.element.id, options)
    }
  }

  cssJobsUpdate (data) {
    let elementJob = data.elements.find(element => element.id === this.state.element.id)
    if (!elementJob) {
      console.warn('Failed to find element', data, this.state.element)
      return
    }
    if (this.state.cssBuildingProcess !== elementJob.jobs) {
      this.setState({ cssBuildingProcess: elementJob.jobs })
    }
    if (!this.state.cssBuildingProcess && !elementJob.jobs && !this.state.isRendered) {
      this.setState({ isRendered: true })
    }
  }

  elementComponentTransformation (data) {
    if (data && data.transformed) {
      this.props.api.notify('element:didUpdate', this.props.element.id)
    }
  }

  getContent (content) {
    let returnData = null
    const currentElement = cook.get(this.state.element) // optimize
    let elementsList = DocumentData.children(currentElement.get('id')).map((childElement) => {
      let elements = [ <Element element={childElement} key={childElement.id} api={this.props.api} /> ]
      if (childElement.tag === 'column') {
        elements.push(
          <ColumnResizer key={`columnResizer-${childElement.id}`} linkedElement={childElement.id}
            api={this.props.api} />
        )
      }
      return elements
    })
    let visibleElementsList = DocumentData.children(currentElement.get('id')).filter(childElement => childElement.hidden !== true)
    if (visibleElementsList.length) {
      returnData = elementsList
    } else {
      returnData = currentElement.containerFor().length > 0
        ? <ContentControls api={this.props.api} id={currentElement.get('id')} /> : content
    }
    return returnData
  }

  visualizeNestedAttributes (options) {
    const returnValue = {}
    returnValue.value = []
    const { element, attrKey, attrSettings, allowInline, id } = options
    const settings = attrSettings.settings.options.settings
    const attrValue = element.get(attrKey).value
    attrValue.forEach((value, i) => {
      returnValue.value[ i ] = {}
      Object.keys(value).forEach((propKey) => {
        if (settings[ propKey ] && settings[ propKey ].options && settings[ propKey ].options.inline) {
          returnValue.value[ i ][ propKey ] =
            <ContentEditableComponent id={id} fieldKey={attrKey} paramIndex={i} paramField={propKey} fieldType={settings[ propKey ].type} api={this.props.api}
              options={{
                ...attrSettings.settings.options,
                allowInline
              }}>
              {value[ propKey ] || ''}
            </ContentEditableComponent>
        } else {
          returnValue.value[ i ][ propKey ] = value[ propKey ]
        }
      })
    })
    return returnValue
  }

  visualizeAttributes (element) {
    let layoutAtts = {}
    let atts = element.getAll(false)
    let allowInline = true
    const mobileDetect = new MobileDetect(window.navigator.userAgent)
    if (mobileDetect.mobile() && (mobileDetect.tablet() || mobileDetect.phone())) {
      allowInline = false
    }
    Object.keys(atts).forEach((fieldKey) => {
      const attrSettings = element.settings(fieldKey)
      const type = attrSettings.type && attrSettings.type.name ? attrSettings.type.name : ''
      const options = attrSettings.settings.options ? attrSettings.settings.options : {}
      let value = atts[ fieldKey ]

      let isDynamic = false
      if (vcCake.env('VCV_JS_FT_DYNAMIC_FIELDS') && typeof options.dynamicField !== 'undefined') {
        if ([ 'string', 'htmleditor' ].indexOf(type) !== -1 && value.match(blockRegexp)) {
          isDynamic = true
        } else if ([ 'attachimage' ].indexOf(type) !== -1) {
          value = value.full ? value.full : (value.urls && value.urls[ 0 ] ? value.urls[ 0 ].full : '')
          isDynamic = value.match(blockRegexp)
        }
      }

      if (isDynamic) {
        const blockInfo = value.split(blockRegexp)

        layoutAtts[ fieldKey ] = getDynamicFieldsData(
          {
            fieldKey: fieldKey,
            value: value,
            blockName: blockInfo[ 3 ],
            blockAtts: JSON.parse(blockInfo[ 4 ].trim()),
            blockContent: blockInfo[ 7 ]
          },
          {
            fieldKey: fieldKey,
            fieldType: attrSettings.type.name,
            fieldOptions: attrSettings.settings.options
          }
        )
      } else if (attrSettings.settings.options && attrSettings.settings.options.inline) {
        layoutAtts[ fieldKey ] =
          <ContentEditableComponent id={atts.id} fieldKey={fieldKey} fieldType={attrSettings.type.name} api={this.props.api}
            options={{
              ...attrSettings.settings.options,
              allowInline
            }}>
            {value || ''}
          </ContentEditableComponent>
      } else if (attrSettings.settings.type === 'paramsGroup') {
        const options = {}
        options.element = element
        options.attrKey = fieldKey
        options.attrSettings = attrSettings
        options.allowInline = allowInline
        options.id = atts.id
        layoutAtts[ fieldKey ] = this.visualizeNestedAttributes(options)
      } else {
        layoutAtts[ fieldKey ] = value
      }
    })
    return layoutAtts
  }

  render () {
    if (this.state.cssBuildingProcess && !this.state.isRendered) {
      return null
    }
    let { api, ...other } = this.props
    let element = this.state.element
    let cookElement = cook.get(element)
    if (!cookElement) {
      return null
    }
    if (element && element.hidden) {
      return null
    }
    let id = cookElement.get('id')
    let ContentComponent = cookElement.getContentComponent()
    if (!ContentComponent) {
      return null
    }
    let editor = {
      'data-vcv-element': id
    }
    if (cookElement.get('metaDisableInteractionInEditor')) {
      editor[ 'data-vcv-element-disable-interaction' ] = true
    }

    return (
      <ContentComponent
        ref={this.elementComponentRef}
        id={id}
        key={'vcvLayoutContentComponent' + id}
        atts={this.visualizeAttributes(cookElement)}
        rawAtts={cookElement.getAll(false)}
        api={api}
        editor={editor}
        {...other}>
        {this.getContent()}
      </ContentComponent>
    )
  }
}
