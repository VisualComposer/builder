import React from 'react'
export default class ContentEditableComponent extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    id: React.PropTypes.string.isRequired,
    field: React.PropTypes.string.isRequired,
    fieldType: React.PropTypes.string.isRequired,
    children: React.PropTypes.string,
    className: React.PropTypes.string,
    options: React.PropTypes.object
  }

  constructor (props) {
    super(props)
    this.iframe = document.querySelector('#vcv-editor-iframe')
    this.iframeWindow = this.iframe && this.iframe.contentWindow
    this.iframeDocument = this.iframeWindow && this.iframeWindow.document
    this.state = {
      contentEditable: false,
      trackMouse: false,
      html: ContentEditableComponent.spinnerHTML,
      realContent: this.props.children,
      mouse: null,
      overlayTimeout: null
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.contentEditable !== true && nextProps.children !== this.state.realContent) {
      this.setState({ realContent: nextProps.children })
    }
  }

  render () {
    const props = {
      dangerouslySetInnerHTML: { __html: this.state.html },
      'data-vcvs-html': this.state.realContent
    }
    return React.createElement('vcvhelper', props)
  }
}
