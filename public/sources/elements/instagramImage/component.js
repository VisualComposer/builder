/* global React, vcvAPI */
/*eslint no-unused-vars: 0*/
class Component extends vcvAPI.elementComponent {
  componentDidMount () {

  }

  componentWillReceiveProps (nextProps) {

  }

  render () {
    let { id, atts, editor } = this.props
    let { embed, designOptions, customClass } = atts
    let classes = 'vce-flickr-image vce'
    let customProps = {}

    if (typeof customClass === 'string' && customClass) {
      classes += ' ' + customClass
    }

    // if (typeof embed === 'string' && embed) {
    //   httpGetAsync('https://api.instagram.com/oembed/?url=' + embed, response)
    // }
    //
    // function response(resp) {
    //   console.log(resp)
    // }
    //
    // function httpGetAsync(theUrl, callback)
    // {
    //   var xmlHttp = new XMLHttpRequest();
    //   xmlHttp.onreadystatechange = function() {
    //     if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
    //       callback(xmlHttp.responseText);
    //   }
    //   xmlHttp.open("GET", theUrl, true); // true for asynchronous
    //   xmlHttp.send(null);
    // }

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
