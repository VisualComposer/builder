/* global React, vcvAPI */
/*eslint no-unused-vars: 0*/
class Component extends vcvAPI.elementComponent {
  componentDidMount () {
    this.insertTwitter()
  }

  componentWillReceiveProps (nextProps) {
    this.insertTwitter()
  }

  render () {
    let { id, atts, editor } = this.props
    let { designOptions, customClass, alignment, twitterOptions } = atts
    let classes = 'vce-twitter-publisher vce'
    let innerClasses = 'vce-twitter-publisher-inner'
    let customProps = {}

    if (typeof customClass === 'string' && customClass) {
      classes += ' ' + customClass
    }

    if (alignment) {
      classes += ` vce-twitter-publisher--align-${alignment}`
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
      <div className={innerClasses}>
      </div>
    </div>
  }

  insertTwitter () {
    var loadJSONP = (() => {
      let unique = 0
      return function(url, callback, context) {
        // INIT
        let name = '_jsonp_' + unique++
        if (url.match(/\?/)) url += '&callback=' + name
        else url += '?callback=' + name

        // Create script
        let script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = url

        // Setup handler
        window[name] = function(data) {
          callback.call((context || window), data)
          document.getElementsByTagName('head')[0].removeChild(script)
          script = null
          delete window[name]
        }

        // Load JSON
        document.getElementsByTagName('head')[0].appendChild(script)
      }
    })()

    loadJSONP(
      'https://publish.twitter.com/oembed.json?url=https://twitter.com/VKontrole/status/791178985820618752',
      (data) => {
        console.log(data)

        this.appendTwitter(data.html)
      }
    )
  }

  appendTwitter (tagString = '') {
    const component = this.getDomNode().querySelector('.vce-twitter-publisher-inner')
    let range = document.createRange()
    let documentFragment = range.createContextualFragment(tagString)
    component.innerHTML = ''
    component.appendChild(documentFragment)
  }
}
