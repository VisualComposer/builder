import React from 'react'
import { getService } from 'vc-cake'

const vcvAPI = getService('api')

export default class WpWidgetsDefault extends vcvAPI.elementComponent {
  constructor(props) {
    super(props)
    this.vcvhelper = React.createRef()
  }

  componentDidMount () {
    super.updateShortcodeToHtml(WpWidgetsDefault.getShortcode(this.props.atts), this.vcvhelper.current)
  }

  componentDidUpdate (props) {
    // update only if shortcode field did change
    if (WpWidgetsDefault.getShortcode(this.props.atts) !== WpWidgetsDefault.getShortcode(props.atts)) {
      super.updateShortcodeToHtml(WpWidgetsDefault.getShortcode(this.props.atts), this.vcvhelper.current)
    }
  }

  static getShortcode (atts) {
    const widgetAtts = {
      before_title: atts.customWidgetHtml ? atts.atts_before_title : '',
      after_title: atts.customWidgetHtml ? atts.atts_after_title : '',
      before_widget: atts.customWidgetHtml ? atts.atts_before_widget : '',
      after_widget: atts.customWidgetHtml ? atts.atts_after_widget : ''
    }

    const widgetKey = window.encodeURIComponent(atts.widgetKey)
    const instance = window.encodeURIComponent(JSON.stringify(atts.widget))
    const args = window.encodeURIComponent(JSON.stringify(widgetAtts))

    return `[vcv_widgets tag="${atts.tag}" key="${widgetKey}" instance="${instance}" args="${args}"]`
  }

  render () {
    const { id, atts, editor } = this.props
    const { customClass, metaCustomId } = atts
    const containerClasses = ['vce-widgets-container']

    const customProps = {}
    if (customClass) {
      containerClasses.push(customClass)
    }
    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    const doAll = this.applyDO('all')

    return (
      <div className={containerClasses.join(' ')} {...customProps} {...editor}>
        <div className='vce vce-widgets-wrapper' id={'el-' + id} {...doAll}>
          <div className='vcvhelper' ref={this.vcvhelper} data-vcvs-html={WpWidgetsDefault.getShortcode(this.props.atts)} />
        </div>
      </div>
    )
  }
}
