/* global React, vcvAPI */
/*eslint no-unused-vars: 0*/
class Component extends vcvAPI.elementComponent {
  componentDidMount () {
    if (this.props.atts.size) {
      this.checkCustomSize(this.props.atts.size)
    }
    this.updateInstagramHtml(this.props.atts.embed)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.atts.size) {
      this.checkCustomSize(nextProps.atts.size)
    } else {
      this.setState({
        imgSize: null
      })
    }
    this.updateInstagramHtml(nextProps.atts.embed)
  }

  render () {
    let { id, atts, editor } = this.props
    let { embed, designOptions, customClass, size, alignment } = atts
    let classes = 'vce-instagram-image vce'
    let customProps = {}
    let innerCustomProps = {}

    if (typeof customClass === 'string' && customClass) {
      classes += ' ' + customClass
    }

    if (typeof size === 'string' && size) {
      innerCustomProps.style = this.state ? this.state.imgSize : null
    }

    if (alignment) {
      classes += ` vce-instagram-image--align-${alignment}`
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
    return <div {...customProps} className={classes} id={'el-' + id} {...editor}>
    <div className='vce-instagram-image-inner' {...innerCustomProps} />
  </div>
  }

  checkCustomSize (size) {
    size = size.toLowerCase()

    if (size.match(/\d*/)[0] === '') {
      switch (size) {
        case 'thumbnail':
          size = 150
          break
        case 'medium':
          size = 300
          break
        case 'large':
          size = 660
          break
        case 'full':
          size = ''
          break
        default:
          size = ''
      }
    }
    this.setSizeState(size)
  }

  setSizeState (size) {
    this.setState({
      imgSize: {
        maxWidth: size + 'px'
      }
    })
  }

  updateInstagramHtml (tagString = '') {
    const component = this.getDomNode().querySelector('.vce-instagram-image-inner')
    let range = document.createRange()
    let documentFragment = range.createContextualFragment(tagString)
    component.innerHTML = ''
    component.appendChild(documentFragment)
  }
}
