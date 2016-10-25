/* global React, vcvAPI */
/*eslint no-unused-vars: 0*/
class Component extends vcvAPI.elementComponent {
  componentDidMount () {
    this.setFlickrWidget()
  }

  componentWillReceiveProps (nextProps) {

  }
  setFlickrWidget () {
    const ReactDOM = require('react-dom')
    const component = ReactDOM.findDOMNode(this)
    component.innerHTML = 'test<br/><a data-flickr-embed="true" href="https://www.flickr.com/photos/thomasheaton/21171377373/" title="Dartmoor Wildcamp">' +
      '<img src="https://c6.staticflickr.com/6/5671/21171377373_ae0c1f3fcc_z.jpg" width="640" height="427" alt="Dartmoor Wildcamp">' +
      '</a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>'
  }
  render () {
    let { id, atts, editor } = this.props
    let { embed, designOptions, customClass, alignment } = atts
    let classes = 'vce-flickr-image vce'
    let customProps = {}

    if (typeof customClass === 'string' && customClass) {
      classes += ' ' + customClass
    }

    if (alignment) {
      classes += ` vce-flickr-image--align-${alignment}`
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
    return <div {...customProps} className={classes} id={'el-' + id} {...editor} dangerouslySetInnerHTML={{__html:embed}} />
  }
}
