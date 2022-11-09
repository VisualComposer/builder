import React from 'react'
import { getService, getStorage } from 'vc-cake'
import classNames from 'classnames'
import { addRowColumnBackground } from './tools'

const vcvAPI = getService('api')
const elementsSettingsStorage = getStorage('elementsSettings')
const fieldOptionsStorage = getStorage('fieldOptions')
const extendedOptionsState = elementsSettingsStorage.state('extendedOptions')
const documentManager = getService('document')
const elementsStorage = getStorage('elements')

export default class ColumnElement extends vcvAPI.elementComponent {
  constructor (props) {
    super(props)
    this.parentId = props.atts.parent
    this.handleStorageChange = this.handleStorageChange.bind(this)
    this.handleElementUpdate = this.handleElementUpdate.bind(this)
    this.handleElementRemove = this.handleElementRemove.bind(this)
    this.handleElementMove = this.handleElementMove.bind(this)
  }

  componentDidMount () {
    const currentState = extendedOptionsState.get()
    if (!currentState || (currentState && !currentState.elements.includes(this.props.id))) {
      extendedOptionsState.onChange(this.handleStorageChange)
      const options = {
        fieldKey: false,
        fieldType: false,
        id: this.props.id
      }
      fieldOptionsStorage.trigger('fieldOptionsChange', options)
    }

    elementsStorage.on('update', this.handleElementUpdate)
    elementsStorage.on('remove', this.handleElementRemove)
    elementsStorage.on(`element:move:${this.props.id}`, this.handleElementMove)
  }

  componentWillUnmount () {
    elementsStorage.off('update', this.handleElementUpdate)
    elementsStorage.off('remove', this.handleElementRemove)
    elementsStorage.off(`element:move:${this.props.id}`, this.handleElementMove)
  }

  componentDidUpdate () {
    this.handleStorageChange(false)
  }

  handleElementUpdate (id, element) {
    if (id === this.props.id) {
      addRowColumnBackground(id, element, element.parent, documentManager, elementsStorage)
    }
  }

  handleElementRemove (id) {
    if (id === this.props.id) {
      const element = documentManager.get(this.props.id)
      addRowColumnBackground(id, element, this.props.atts.parent, documentManager, elementsStorage)
    }
  }

  handleElementMove (element) {
    // Update old row
    addRowColumnBackground(element.id, element, element.parent, documentManager, elementsStorage)

    // Update new row
    const newElement = documentManager.get(this.props.id)
    addRowColumnBackground(newElement.id, newElement, newElement.parent, documentManager, elementsStorage)
  }

  handleStorageChange (data) {
    let dataFromState = extendedOptionsState.get()
    if (data) {
      dataFromState = data
      extendedOptionsState.ignoreChange(this.handleStorageChange)
    }
    if (!dataFromState) {
      return
    }
    const elementData = dataFromState.elements.find(el => el.id === this.props.id)
    if (elementData) {
      elementsSettingsStorage.state('elementOptions').set({ ...elementData })
    }
  }

  getWidthClass (widthValue, device) {
    const className = `vce-col--${device}-`

    if (!widthValue) {
      return className + 'auto'
    }

    if (widthValue.includes('px')) {
      return className + widthValue.replace('px', '-px')
    }
    return className + (widthValue.replace('/', '-').replace('%', 'p').replace(',', '-').replace('.', '-'))
  }

  render () {
    // import variables
    const { id, atts, editor, isBackend } = this.props
    const { size, customClass, metaCustomId, designOptionsAdvanced, lastInRow, firstInRow, hidden, disableStacking, sticky, boxShadow, extraDataAttributes } = atts

    // import template js
    const customColProps = this.getExtraDataAttributes(extraDataAttributes)
    let innerProps = {}
    const classes = ['vce-col']

    classes.push(this.getBackgroundClass(designOptionsAdvanced))

    if (hidden && isBackend) {
      classes.push('vce-wpbackend-element-hidden')
    }

    if (disableStacking) {
      classes.push(this.getWidthClass(size.all, 'xs'))

      if (lastInRow.all) {
        classes.push('vce-col--all-last')
      }

      if (firstInRow.all) {
        classes.push('vce-col--all-first')
      }
    } else {
      if (size.all) {
        if (size.all === 'hide') {
          classes.push('vce-col--all-hide')
        } else {
          classes.push(this.getWidthClass(size.all, 'md'))
          classes.push('vce-col--xs-1 vce-col--xs-last vce-col--xs-first vce-col--sm-last vce-col--sm-first')

          if (lastInRow.all) {
            classes.push('vce-col--md-last vce-col--lg-last vce-col--xl-last')
          }

          if (firstInRow.all) {
            classes.push('vce-col--md-first vce-col--lg-first vce-col--xl-first')
          }
        }
      } else { // Custom device column size
        Object.keys(size).forEach((device) => {
          let deviceSize = size[device]

          if (deviceSize === '') {
            deviceSize = 'auto'
          }

          if (device !== 'defaultSize') {
            classes.push(this.getWidthClass(deviceSize, device))

            if (deviceSize !== 'hide') {
              classes.push(`vce-col--${device}-visible`)
            }

            if (lastInRow[device]) {
              classes.push(`vce-col--${device}-last`)
            }

            if (firstInRow[device]) {
              classes.push(`vce-col--${device}-first`)
            }
          }
        })
      }
    }

    if (typeof customClass === 'string' && customClass.length) {
      classes.push(customClass)
    }

    const className = classNames(classes)
    if (metaCustomId) {
      innerProps.id = metaCustomId
    }

    let stickyAttributes = {}
    if (sticky && sticky.device) {
      stickyAttributes = this.getStickyAttributes(sticky)
    }

    let boxShadowAttributes = {}
    if (boxShadow && boxShadow.device) {
      boxShadowAttributes = this.getBoxShadowAttributes(boxShadow, id)
    }

    customColProps['data-vce-delete-attr'] = 'style'
    innerProps['data-vce-delete-attr'] = 'style'

    innerProps = { ...innerProps, ...stickyAttributes }

    const contentProps = {}
    contentProps['data-vce-element-content'] = true

    const doPadding = this.applyDO('padding')
    const doRest = this.applyDO('border margin background animation')

    return (
      <div className={className} {...customColProps} id={'el-' + id} {...editor}>
        <div className='vce-col-inner' {...doRest} {...innerProps} {...boxShadowAttributes}>
          {this.getBackgroundTypeContent()}
          {this.getContainerDivider()}
          <div className='vce-col-content' {...contentProps} {...doPadding}>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}
