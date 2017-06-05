import {Component, PropTypes} from 'react'
import {getService} from 'vc-cake'
const dataProcessor = getService('dataProcessor')

export default class DynamicWordpressContent extends Component {
  static spinnerHTML = '<span class="vcv-ui-content-editable-helper-loader vcv-ui-wp-spinner"></span>'
  static propTypes = {
    content: PropTypes.string.isRequired
  }
  componentDidMount () {
    this.updateShortcodeToHtml(this.props.content || {})
  }

  componentDidUpdate (props) {
    // update only if shortcode field did change
    if (this.props.content !== props.content) {
      this.updateShortcodeToHtml(props.content || {})
    }
  }

  // [gallery ids="318,93"]
  getShortcodesRegexp () {
    return RegExp('\\[(\\[?)(\\w+\\b)(?![\\w-])([^\\]\\/]*(?:\\/(?!\\])[^\\]\\/]*)*?)(?:(\\/)\\]|\\](?:([^\\[]*(?:\\[(?!\\/\\2\\])[^\\[]*)*)(\\[\\/\\2\\]))?)(\\]?)')
  }

  updateShortcodeToHtml (content) {
    if (content.match(this.getShortcodesRegexp())) {
      this.updateHtml(DynamicWordpressContent.spinnerHTML)
      dataProcessor.appServerRequest({
        'vcv-action': 'elements:ajaxShortcode:adminNonce',
        'vcv-shortcode-string': content,
        'vcv-nonce': window.vcvNonce,
        'vcv-source-id': window.vcvSourceID
      }).then((data) => {
        this.updateHtml(data)
      })
    } else {
      this.updateHtml(content)
    }
  }

  updateHtml (tagString) {
    this.setState({content: tagString})
  }
  render () {
    return this.state.content
  }
}
