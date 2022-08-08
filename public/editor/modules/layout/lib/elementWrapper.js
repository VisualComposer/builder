import React, { forwardRef, useEffect, useCallback } from 'react'
import ReactDOM from 'react-dom'
import vcCake from 'vc-cake'
import { connect } from 'react-redux'
import { cloneDeep } from 'lodash'
import ElementInner from './elementInner'
import ColumnResizer from 'public/components/columnResizer/columnResizer'
import EmptyCommentElementWrapper from './emptyCommentElementWrapper'
import Element from './element'
import ContentControls from 'public/components/layoutHelpers/contentControls/component'

const cook = vcCake.getService('cook')
const assetsStorage = vcCake.getStorage('assets')
const documentManager = vcCake.getService('document')
const roleManager = vcCake.getService('roleManager')

const {
  updateDynamicComments,
  cleanComments
} = cook.dynamicFields

const ElementWrapper = forwardRef((props, ref) => {
  const cookElement = props.elementData ? cook.get(props.elementData) : null
  const rawAtts = cookElement ? cloneDeep(cookElement.getAll(false)) : {}

  useEffect(() => {
    if (cookElement && ref.current) {
      updateDynamicComments(ref.current, props.id, cookElement)
    }

    return () => {
      if (ref.current) {
        const el = ReactDOM.findDOMNode(ref.current) // eslint-disable-line
        cleanComments(el, props.id)
      }
    }
  }, [props.element, props.id, ref, cookElement])

  const getContent = useCallback(() => {
    let returnData = null
    const currentElementId = props.id
    const elementsList = documentManager.children(props.id).map((childElement) => {
      const elements = [<Element id={childElement.id} key={childElement.id} api={props.api} />]
      if (childElement.tag === 'column') {
        if (!vcCake.env('VCV_ADDON_ROLE_MANAGER_ENABLED') || roleManager.can('editor_settings_element_lock', roleManager.defaultAdmin()) || !props.elementData?.metaIsElementLocked) {
          elements.push(
            <ColumnResizer
              key={`columnResizer-${childElement.id}`} linkedElement={childElement.id}
              api={props.api}
              rowId={currentElementId}
            />
          )
        }
      }
      return elements
    })
    const visibleElementsList = documentManager.children(currentElementId).filter(childElement => childElement.hidden !== true)
    if (visibleElementsList.length) {
      returnData = elementsList
    } else {
      if (cookElement.containerFor().length > 0) {
        if (vcCake.env('VCV_ADDON_ROLE_MANAGER_ENABLED') && !roleManager.can('editor_settings_element_lock', roleManager.defaultAdmin()) && cookElement.get('metaIsElementLocked')) {
          returnData = <EmptyCommentElementWrapper />
        } else {
          returnData =
            <EmptyCommentElementWrapper><ContentControls api={props.api} id={currentElementId} /></EmptyCommentElementWrapper>
        }
      } else {
        returnData = <EmptyCommentElementWrapper />
      }
    }

    return !returnData ? <EmptyCommentElementWrapper /> : returnData
  }, [cookElement, props.elementData, props.api, props.id])

  if (!cookElement) {
    return null
  }

  if (props.elementData.hidden) {
    return null
  }

  const ContentComponent = cookElement.getContentComponent()
  if (!ContentComponent) {
    return null
  }

  const ElementComponent = props.elementData.tag === 'row' ? ElementInner : ContentComponent

  return (
    <ElementComponent
      {...props}
      contentComponent={ContentComponent}
      editor={props.getEditorProps(props.id, cookElement)}
      atts={cook.visualizeAttributes(cookElement, props.api)}
      rawAtts={rawAtts}
      ref={ref}
    >
      {getContent()}
    </ElementComponent>
  )
})

ElementWrapper.displayName = 'ElementWrapper'

const mapStateToProps = (state, props) => ({ elementData: state.document.documentData[props.id] })

export default connect(mapStateToProps, null, null, { forwardRef: true })(ElementWrapper)
