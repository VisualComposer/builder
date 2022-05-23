import React from 'react'
import vcCake from 'vc-cake'
import lodash from 'lodash'

const vcvAPI = vcCake.getService('api')

export default class ShortcodeElement extends vcvAPI.elementComponent {
  constructor (props) {
    super(props)
    this.vcvhelper = React.createRef();

    this.delayedShortcodeUpdate = lodash.debounce(this.updateShortcodeElement, 500)
  }

  componentDidMount () {
    super.updateShortcodeToHtml(this.props.atts.shortcode, this.vcvhelper.current)
  }

  updateShortcodeElement () {
    super.updateShortcodeToHtml(this.props.atts.shortcode, this.vcvhelper.current)
  }

  componentDidUpdate (props) {
    // update only if shortcode field did change
    if (this.props.atts.shortcode !== props.atts.shortcode) {
      this.delayedShortcodeUpdate()
    }
  }

  render () {
    const { id, atts, editor } = this.props
    const { shortcode, customClass, metaCustomId } = atts
    let shortcodeClasses = 'vce-shortcode'
    const wrapperClasses = 'vce-shortcode-wrapper vce'

    const customProps = {}
    if (typeof customClass === 'string' && customClass) {
      shortcodeClasses = shortcodeClasses.concat(' ' + customClass)
    }
    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    const doAll = this.applyDO('all')

    return (
      <div className={shortcodeClasses} {...editor} {...customProps}>
        <div className={wrapperClasses} id={'el-' + id} {...doAll}>
          <div className='vcvhelper' ref={this.vcvhelper} data-vcvs-html={shortcode} />
        </div>
      </div>
    )
  }
}
