import React from 'react'
import { getService, env } from 'vc-cake'

const vcvAPI = getService('api')

export default class InstagramImage extends vcvAPI.elementComponent {
  constructor (props) {
    super(props)
    this.updateInstagramEmbed = this.updateInstagramEmbed.bind(this)
    this.renderInstagramEmbed = this.renderInstagramEmbed.bind(this)
    this.instaRef = React.createRef()
  }

  componentDidMount () {
    this.props.editor && this.updateHtml(this.props.atts.instagramEmbed)
    env('iframe').vcv.on('ready', this.updateInstagramEmbed)
  }

  componentWillUnmount () {
    env('iframe').vcv.off('ready', this.updateInstagramEmbed)
  }

  updateInstagramEmbed (action, id) {
    if (action === 'update' && id === this.props.id) {
      setTimeout(this.renderInstagramEmbed, 100)
    }
  }

  renderInstagramEmbed () {
    const iframeWindow = env('iframe')
    if (iframeWindow.instgrm && iframeWindow.instgrm.Embeds && iframeWindow.instgrm.Embeds.process) {
      iframeWindow.instgrm.Embeds.process()
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.atts.instagramEmbed !== prevProps.atts.instagramEmbed) {
      this.props.editor && this.updateHtml(this.props.atts.instagramEmbed)
    }
  }

  updateHtml (embedCode) {
    const component = this.instaRef.current
    this.updateInlineHtml(component, embedCode)
  }

  render () {
    const { id, atts, editor } = this.props
    const { customClass, metaCustomId, extraDataAttributes } = atts
    let classes = 'vce-instagram-image'
    const wrapperClasses = 'vce-instagram-image-wrapper vce'
    const customProps = this.getExtraDataAttributes(extraDataAttributes)

    if (typeof customClass === 'string' && customClass) {
      classes += ' ' + customClass
    }

    customProps.key = `customProps:${id}`

    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    const doAll = this.applyDO('all')

    return (
      <div {...customProps} className={classes} {...editor}>
        <div className={wrapperClasses} id={'el-' + id} {...doAll} ref={this.instaRef} />
      </div>
    )
  }
}
