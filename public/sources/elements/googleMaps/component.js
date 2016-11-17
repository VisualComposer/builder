/* global React, vcvAPI */
/*eslint no-unused-vars: 0*/
class Component extends vcvAPI.elementComponent {
  constructor (props) {
    super(props)
    this.setCustomSize = this.setCustomSize.bind(this)
  }

  defaultSize = {
    width: '600',
    height: '450'
  }

  componentDidMount () {
    if (this.props.atts.height || this.props.atts.width || this.props.atts.proportional) {
      let size = this.props.atts.embed ? this.getDefaultSize(this.props.atts.embed) : ''
      let defaultSize = {
        width: size && size.width ? size.width : this.defaultSize.width,
        height: size && size.height ? size.height : this.defaultSize.height
      }
      this.setCustomSize(this.props.atts, defaultSize)
    }

    if (this.props.atts.embed) {
      this.appendMap(this.props.atts.embed)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.atts.height || nextProps.atts.width || nextProps.atts.proportional) {
      let size = this.getDefaultSize(nextProps.atts.embed)

      let defaultSize = {
        width: size && size.width ? size.width : this.defaultSize.width,
        height: size && size.height ? size.height : this.defaultSize.height
      }
      this.setCustomSize(nextProps.atts, defaultSize)
    } else {
      this.setState({
        size: null
      })
    }

    if (nextProps.atts.embed && (this.props.atts.embed !== nextProps.atts.embed || this.props.atts.width !== nextProps.atts.width || this.props.atts.height !== nextProps.atts.height || this.props.atts.proportional !== nextProps.atts.proportional)) {
      this.appendMap(nextProps.atts.embed)
    }
  }

  getDefaultSize (embed) {
    let size = {}

    let widthAttr = embed.match(/width="\d+"/g)
    widthAttr = widthAttr ? widthAttr[0] : ''

    if (widthAttr) {
      let width = widthAttr.match(/\d+/g)
      width = width ? width[0] : ''
      size.width = width
    }

    let heightAttr = embed.match(/height="\d+"/g)
    heightAttr = heightAttr ? heightAttr[0] : ''

    if (heightAttr) {
      let height = heightAttr.match(/\d+/g)
      height = height ? height[0] : ''
      size.height = height
    }
    return size
  }

  setCustomSize (atts, defaultSize) {
    let width = this.validateSize(atts.width)
    let height = this.validateSize(atts.height)

    width = /^\d+$/.test(width) ? `${width}px` : width
    height = /^\d+$/.test(height) ? `${height}px` : height

    let customSize = {
      width: width ? width : `${defaultSize.width}px`,
      height: height ? height : `${defaultSize.height}px`
    }

    if (atts.proportional) {
      customSize.paddingBottom = this.setProportions(customSize.width, customSize.height)
      customSize.height = 'auto'
    }

    this.setSizeState(customSize)
  }

  setProportions (width, height) {
    let customWidth = width.indexOf('px') < 0
    let customHeight = height.indexOf('px') < 0

    if (customWidth || customHeight) {
      let div = document.createElement('div')
      this.refs.mapContainer.appendChild(div)

      if (customWidth) {
        div.style.width = width
        div.style.maxWidth = '100%'
        width = div.getBoundingClientRect().width
      }
      if (customHeight) {
        if (height.indexOf('%') >= 0) {
          div.style.minHeight = '150px'
          this.refs.mapContainer.style.height = '100%'
        }

        div.style.height = height
        height = div.getBoundingClientRect().height

        div.style.minHeight = ''
        this.refs.mapContainer.style.height = ''
      }
      this.refs.mapContainer.removeChild(div)
    }

    if (!customWidth) {
      width = typeof width === 'string' ? width.replace('px', '') : width
    }

    if (!customHeight) {
      height = typeof height === 'string' ? height.replace('px', '') : height
    }

    return height / width * 100 + '%'
  }

  setSizeState (size) {
    this.setState({ size })
  }

  validateSize (value) {
    let units = [ 'px', 'em', 'rem', '%', 'vw', 'vh' ]
    let re = new RegExp('^-?\\d*(\\.\\d{0,9})?(' + units.join('|') + ')?$')
    if (value === '' || value.match(re)) {
      return value
    } else {
      return null
    }
  }

  appendMap (tagString = '') {
    let component = this.refs.mapInner
    component.innerHTML = tagString
  }

  render () {
    let { id, atts, editor } = this.props
    let { designOptions, customClass, alignment, width, height, proportional } = atts
    let classes = 'vce-google-maps vce'
    let innerClasses = 'vce-google-maps-inner'
    let wrapperClasses = 'vce-google-maps-wrapper'
    let customProps = {}
    let innerProps = {}
    let wrapperProps = {}

    if (typeof customClass === 'string' && customClass) {
      classes += ' ' + customClass
    }

    customProps.style = {
      height: this.state ? (this.state.size ? this.state.size.height : null) : null
    }

    wrapperProps.style = {
      width: this.state ? (this.state.size ? this.state.size.width : null) : null,
      height: this.state ? (this.state.size ? this.state.size.height : null) : null
    }

    innerProps.style = {
      paddingBottom: this.state ? (this.state.size ? this.state.size.paddingBottom : null) : null
    }

    if (width) {
      wrapperClasses += ' vce-google-maps--width-custom'
    }

    if (height) {
      wrapperClasses += ' vce-google-maps--height-custom'
    }

    if (proportional) {
      wrapperClasses += ' vce-google-maps-proportional'
    }

    if (alignment) {
      classes += ` vce-google-maps--align-${alignment}`
    }

    customProps.key = `customProps:${id}`

    let devices = designOptions.visibleDevices ? Object.keys(designOptions.visibleDevices) : []
    let animations = []
    devices.forEach((device) => {
      let prefix = designOptions.visibleDevices[ device ]
      if (designOptions[ device ].animation) {
        if (prefix) {
          prefix = `-${prefix}`
        }
        animations.push(`vce-o-animate--${designOptions[ device ].animation}${prefix}`)
      }
    })
    if (animations.length) {
      customProps[ 'data-vce-animate' ] = animations.join(' ')
    }

    return <div {...customProps} className={classes} id={'el-' + id} {...editor} ref='mapContainer'>
      <div className={wrapperClasses} {...wrapperProps} >
        <div className={innerClasses} {...innerProps} ref='mapInner' />
      </div>
    </div>
  }
}
