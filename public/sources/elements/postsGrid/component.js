/* global React, vcvAPI, vcCake */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  state = {
    shortcode: '',
    shortcodeContent: ''
  }

  componentDidMount () {
    this.requestToServer()
  }

  componentDidUpdate (prevProps) {
    let isEqual = require('lodash').isEqual
    if (!isEqual(this.props.atts, prevProps.atts)) {
      this.requestToServer()
    }
  }

  requestToServer () {
    let ajax = vcCake.getService('utils').ajax

    if (this.serverRequest) {
      this.serverRequest.abort()
    }
    let atts = {}

    const Cook = vcCake.getService('cook')
    let GridItemComponent = Cook.get(this.props.atts.gridItem)
    let gridItemOutput = GridItemComponent.render(null, false)
    const ReactDOMServer = require('react-dom/server');
    this.serverRequest = ajax({
      'vcv-action': 'elements:posts_grid:adminNonce',
      'vcv-nonce': window.vcvNonce,
      'vcv-atts': atts, // TODO: Pass correct grid this.props.atts
      'vcv-content': ReactDOMServer.renderToStaticMarkup(gridItemOutput)
    }, (result) => {
      let response = JSON.parse(result.response)
      if (response && response.status) {
        this.setState({
          shortcode: response.shortcode,
          shortcodeContent: response.shortcodeContent || 'Failed to render posts grid'
        })
      } else {
        this.setState({
          shortcode: '',
          shortcodeContent: 'Request to server failed'
        })
      }
    })
  }

  render () {
    let { id, atts, editor } = this.props
    let { designOptions } = atts
    let wrapperClasses = [ 'vce vce-posts-grid-wrapper' ]

    let customProps = {}
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

    let mixinData = this.getMixinData('postsGridGap')
    if (mixinData) {
      wrapperClasses.push(`vce-posts-grid--gap-${mixinData.selector}`)
    }

    mixinData = this.getMixinData('postsGridColumns')
    if (mixinData) {
      wrapperClasses.push(`vce-posts-grid--columns-${mixinData.selector}`)
    }

    return (
      <div className={wrapperClasses.join(' ')} {...customProps} id={'el-' + id} {...editor}>
        <vcvhelper data-vcvs-html={this.state.shortcode || ''}
          dangerouslySetInnerHTML={{ __html: this.state.shortcodeContent || '' }} />
        <div className='vce-posts-grid-list'>
          <article className='vce-posts-grid-item'>
            <div className='vce-posts-grid-background-wrapper'>
              <div className='vce-posts-grid-background' />
            </div>
            <div className='vce-posts-description-content'>
              <div className='vce-posts-description-title'><h4>Got big things ahead</h4></div>
              <div className='vce-posts-description-excerpt'><p>A tatto is a form of body modification, made by inserting
                indelible ink into dermis layer of the skin to change the pigment.</p></div>
            </div>
          </article>
          <article className='vce-posts-grid-item'>
            <div className='vce-posts-grid-background-wrapper'>
              <div className='vce-posts-grid-background' />
            </div>
            <div className='vce-posts-description-content'>
              <div className='vce-posts-description-title'><h4>Got big things ahead</h4></div>
              <div className='vce-posts-description-excerpt'><p>A tatto is a form of body modification, made by inserting
                indelible ink into dermis layer of the skin to change the pigment.</p></div>
            </div>
          </article>
        </div>
      </div>
    )
  }
}
