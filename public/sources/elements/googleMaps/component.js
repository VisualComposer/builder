/* global React, vcvAPI */
/*eslint no-unused-vars: 0*/
class Component extends vcvAPI.elementComponent {
  constructor (props) {
    super(props)
    this.setCustomSize = this.setCustomSize.bind(this)
  }

  componentDidMount () {
    if (this.props.atts.height || this.props.atts.width || this.props.atts.proportional) {
      this.setCustomSize(this.props.atts)
    }

    if (this.props.atts.embed) {
      this.appendMap(this.props.atts.embed)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.atts.height || this.props.atts.width || this.props.atts.proportional) {
      this.setCustomSize(nextProps.atts)
    } else {
      this.setState({
        imgSize: null
      })
    }

    if (nextProps.atts.embed && (this.props.atts.embed !== nextProps.atts.embed || this.props.atts.width !== nextProps.atts.width || this.props.atts.height !== nextProps.atts.height || this.props.atts.proportional !== nextProps.atts.proportional )) {
      this.appendMap(nextProps.atts.embed)
    }
  }

  setCustomSize (atts) {
    let width = this.validateSize(atts.width)
    let height = this.validateSize(atts.height)

    width = /^\d+$/.test(width) ? width + 'px' : width
    height = /^\d+$/.test(height) ? height + 'px' : height

    let size = {
      width: width || null,
      height: height || null
    }

    if (atts.proportional) {
      size.paddingBottom = this.setProportions(size.width, size.height)
      size.height = 'auto'
    }

    this.setSizeState(size)
  }

  setProportions (width, height) {
    if (!width) {
      width = '600px'
    }
    if (!height) {
      height = '450px'
    }

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
