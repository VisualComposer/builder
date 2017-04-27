import React from 'react'
import vcCake from 'vc-cake'
const vcvAPI = vcCake.getService('api')
const dataProcessor = vcCake.getService('dataProcessor')

export default class ShortcodeElement extends vcvAPI.elementComponent {
  static spinnerHTML = '<span class="vcv-ui-content-editable-helper-loader vcv-ui-wp-spinner"></span>'

  componentDidMount () {
    this.updateShortcodeToHtml(this.props.atts.shortcode)
  }

  componentDidUpdate (props) {
    // update only if shortcode field did change
    if (this.props.atts.shortcode !== props.atts.shortcode) {
      this.updateShortcodeToHtml(this.props.atts.shortcode)
    }
  }

  // [gallery ids="318,93"]
  getShortcodesRegexp () {
    return RegExp('\\[(\\[?)(\\w+\\b)(?![\\w-])([^\\]\\/]*(?:\\/(?!\\])[^\\]\\/]*)*?)(?:(\\/)\\]|\\](?:([^\\[]*(?:\\[(?!\\/\\2\\])[^\\[]*)*)(\\[\\/\\2\\]))?)(\\]?)')
  }

  updateShortcodeToHtml (content) {
    if (content.match(this.getShortcodesRegexp())) {
      this.updateHtml(ShortcodeElement.spinnerHTML)
      dataProcessor.appServerRequest({
        'vcv-action': 'elements:ajaxShortcode:adminNonce',
        'vcv-shortcode-string': content,
        'vcv-nonce': window.vcvNonce
      }).then((data) => {
        this.updateHtml(data)
      })
    } else {
      this.updateHtml(content)
    }
  }

  updateHtml (tagString) {
    const component = this.getDomNode().querySelector('.vce-shortcode-wrapper')
    this.updateInlineHtml(component, tagString)
  }

  render () {
    let { id, atts, editor } = this.props
    let { customClass, metaCustomId } = atts
    let shortcodeClasses = 'vce-shortcode'
    let wrapperClasses = 'vce-shortcode-wrapper vce'
    let customProps = {}
    if (typeof customClass === 'string' && customClass) {
      shortcodeClasses = shortcodeClasses.concat(' ' + customClass)
    }

    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    let doAll = this.applyDO('all')

    return <div className={shortcodeClasses} {...editor} {...customProps}>
      <div className={wrapperClasses} id={'el-' + id} {...doAll} />
    </div>
  }
}
