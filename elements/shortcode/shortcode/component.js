import React from 'react'
import vcCake from 'vc-cake'

const vcvAPI = vcCake.getService('api')

export default class ShortcodeElement extends vcvAPI.elementComponent {
  componentDidMount () {
    super.updateShortcodeToHtml(this.props.atts.shortcode, this.refs.vcvhelper)
  }

  componentDidUpdate (props) {
    // update only if shortcode field did change
    if (this.props.atts.shortcode !== props.atts.shortcode) {
      super.updateShortcodeToHtml(this.props.atts.shortcode, this.refs.vcvhelper)
    }
  }

  render () {
    const { id, atts, editor } = this.props
    const { shortcode, customClass, metaCustomId } = atts
    let shortcodeClasses = 'vce-shortcode'
    const wrapperClasses = 'vce-shortcode-wrapper vce'

    let customProps = {}
    if (typeof customClass === 'string' && customClass) {
      shortcodeClasses = shortcodeClasses.concat(' ' + customClass)
    }
    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    const doAll = this.applyDO('all')

    return <div className={shortcodeClasses} {...editor} {...customProps}>
      <div className={wrapperClasses} id={'el-' + id} {...doAll}>
        <div className='vcvhelper' ref='vcvhelper' data-vcvs-html={shortcode} />
      </div>
    </div>
  }
}
