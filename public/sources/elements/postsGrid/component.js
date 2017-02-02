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

    const Cook = vcCake.getService('cook')
    if (!this.props.atts.gridItem || !this.props.atts.sourceItem) {
      return
    }
    let GridItemComponent = Cook.get(this.props.atts.gridItem)
    let SourceItemComponent = Cook.get(this.props.atts.sourceItem)
    let gridItemOutput = GridItemComponent.render(null, false)
    let sourceItemOutput = SourceItemComponent.render(null, false)
    const ReactDOMServer = require('react-dom/server')
    const striptags = require('striptags')
    this.serverRequest = ajax({
      'vcv-action': 'elements:posts_grid:adminNonce',
      'vcv-nonce': window.vcvNonce,
      'vcv-content': ReactDOMServer.renderToStaticMarkup(gridItemOutput),
      'vcv-atts': {
        source: encodeURIComponent(JSON.stringify({
          tag: this.props.atts.sourceItem.tag,
          value: striptags(ReactDOMServer.renderToStaticMarkup(sourceItemOutput))
        })),
        unique_id: this.props.id,
        pagination: this.props.atts.atts_pagination ? '1' : '0',
        pagination_color: this.props.atts.atts_pagination_color,
        pagination_per_page: this.props.atts.atts_pagination_per_page
      }
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
    let { designOptions, customClass, metaCustomId } = atts
    let wrapperClasses = [ 'vce vce-posts-grid-wrapper' ]
    let containerClasses = [ 'vce-posts-grid-container' ]

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

    mixinData = this.getMixinData('postsGridPaginationColor')
    if (mixinData) {
      wrapperClasses.push(`vce-posts-grid-pagination--color-${mixinData.selector}`)
    }

    if (customClass) {
      containerClasses.push(customClass)
    }
    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    return (
      <div className={containerClasses.join(' ')} {...customProps} {...editor}>
        <div className={wrapperClasses.join(' ')} id={'el-' + id}>
          <vcvhelper data-vcvs-html={this.state.shortcode || ''}
            dangerouslySetInnerHTML={{ __html: this.state.shortcodeContent || '' }} />
        </div>
      </div>
    )
  }
}
