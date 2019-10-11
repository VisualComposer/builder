import React from 'react'
import { getService, getStorage } from 'vc-cake'
import classNames from 'classnames'

const vcvAPI = getService('api')
const elementsSettingsStorage = getStorage('elementsSettings')
const fieldOptionsStorage = getStorage('fieldOptions')
const extendedOptionsState = elementsSettingsStorage.state('extendedOptions')

export default class ColumnElement extends vcvAPI.elementComponent {
  constructor (props) {
    super(props)

    this.columnRef = React.createRef()
    this.handleStorageChange = this.handleStorageChange.bind(this)
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
  }

  componentDidUpdate () {
    this.handleStorageChange(false)
  }

  handleStorageChange (data) {
    let dataFromState = extendedOptionsState.get()
    if (data) {
      dataFromState = data
      extendedOptionsState.ignoreChange(this.handleStorageChange)
    }
    const elementData = dataFromState.elements.find(el => el.id === this.props.id)
    if (elementData) {
      const ref = this.columnRef.current
      elementsSettingsStorage.state('elementOptions').set({ ...elementData, ref })
    }
  }

  render () {
    // import variables
    const { id, atts, editor, isBackend } = this.props
    const { size, customClass, metaCustomId, designOptionsAdvanced, lastInRow, firstInRow, hidden, disableStacking, sticky, boxShadow } = atts

    // import template js
    let customColProps = {}
    let innerProps = {}
    let classes = [ 'vce-col' ]

    classes.push(this.getBackgroundClass(designOptionsAdvanced))

    if (hidden && isBackend) {
      classes.push('vce-wpbackend-element-hidden')
    }

    if (disableStacking) {
      classes.push('vce-col--xs-' + (size[ 'all' ] ? size[ 'all' ].replace('/', '-').replace('%', 'p').replace(',', '-').replace('.', '-') : 'auto'))

      if (lastInRow[ 'all' ]) {
        classes.push('vce-col--all-last')
      }

      if (firstInRow[ 'all' ]) {
        classes.push('vce-col--all-first')
      }
    } else {
      if (size[ 'all' ]) {
        if (size[ 'all' ] === 'hide') {
          classes.push('vce-col--all-hide')
        } else {
          classes.push('vce-col--md-' + (size[ 'all' ] ? size[ 'all' ].replace('/', '-').replace('%', 'p').replace(',', '-').replace('.', '-') : 'auto'))
          classes.push('vce-col--xs-1 vce-col--xs-last vce-col--xs-first vce-col--sm-last vce-col--sm-first')

          if (lastInRow[ 'all' ]) {
            classes.push('vce-col--md-last vce-col--lg-last vce-col--xl-last')
          }

          if (firstInRow[ 'all' ]) {
            classes.push('vce-col--md-first vce-col--lg-first vce-col--xl-first')
          }
        }
      } else { // Custom device column size
        Object.keys(size).forEach((device) => {
          let deviceSize = size[ device ]

          if (deviceSize === '') {
            deviceSize = 'auto'
          }

          if (device !== 'defaultSize') {
            classes.push(`vce-col--${device}-` + (deviceSize ? deviceSize.replace('/', '-').replace('%', 'p').replace(',', '-').replace('.', '-') : 'auto'))

            if (deviceSize !== 'hide') {
              classes.push(`vce-col--${device}-visible`)
            }

            if (lastInRow[ device ]) {
              classes.push(`vce-col--${device}-last`)
            }

            if (firstInRow[ device ]) {
              classes.push(`vce-col--${device}-first`)
            }
          }
        })
      }
    }

    if (typeof customClass === 'string' && customClass.length) {
      classes.push(customClass)
    }

    let className = classNames(classes)
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

    customColProps[ 'data-vce-delete-attr' ] = 'style'
    innerProps[ 'data-vce-delete-attr' ] = 'style'

    innerProps = { ...innerProps, ...stickyAttributes }

    let contentProps = {}
    contentProps[ 'data-vce-element-content' ] = true

    const doPadding = this.applyDO('padding')
    const doRest = this.applyDO('border margin background animation')

    return (<div className={className} {...customColProps} id={'el-' + id} {...editor} ref={this.columnRef}>
      <div className='vce-col-inner' {...doRest} {...innerProps} {...boxShadowAttributes}>
        {this.getBackgroundTypeContent()}
        {this.getContainerDivider()}
        <div className='vce-col-content' {...contentProps} {...doPadding}>
          {this.props.children}
        </div>
      </div>
    </div>)
  }
}
