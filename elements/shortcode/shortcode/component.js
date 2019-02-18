import React from 'react'
import vcCake from 'vc-cake'

const vcvAPI = vcCake.getService('api')

export default class ShortcodeElement extends vcvAPI.elementComponent {
  componentDidMount () {
    super.updateShortcodeToHtml(this.props.atts.shortcode, this.refs.vcvhelper)

    if (!window.wp || !window.wp.shortcode || !window.VCV_API_WPBAKERY_WPB_MAP) {
      return
    }
    this.multipleShortcodesRegex = window.wp.shortcode.regexp(window.VCV_API_WPBAKERY_WPB_MAP().join('|'))
    this.localShortcodesRegex = new RegExp(this.multipleShortcodesRegex.source)
  }

  componentDidUpdate (props) {
    // update only if shortcode field did change
    if (this.props.atts.shortcode !== props.atts.shortcode) {
      super.updateShortcodeToHtml(this.props.atts.shortcode, this.refs.vcvhelper)
      let css = this.getCustomCss(this.props.atts.shortcode, '')
      if (css && this.refs.style) {
        this.refs.style.innerHTML = css
      }
    }
  }

  getCustomCss (shortcode) {
    if (!this.multipleShortcodesRegex || !this.localShortcodesRegex) {
      return
    }
    let multipleMatch = shortcode.match(this.multipleShortcodesRegex)
    let css = ''
    if (multipleMatch && multipleMatch.length) {
      multipleMatch.forEach((single) => {
        let localMatch = single.match(this.localShortcodesRegex)
        if (localMatch && localMatch.length) {
          let params = window.wp.shortcode.attrs(localMatch[ 3 ] || '').named
          if (params.css) {
            // custom css
            css += params.css
          }
          if (localMatch[ 5 ]) {
            css += this.getCustomCss(localMatch[ 5 ])
          }
        }
      })
    }

    return css
  }

  render () {
    let { id, atts, editor } = this.props
    let { shortcode, customClass, metaCustomId } = atts
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
      <div className={wrapperClasses} id={'el-' + id} {...doAll}>
        <style className='vcvhelper' ref='style' />
        <div className='vcvhelper' ref='vcvhelper' data-vcvs-html={shortcode} />
      </div>
    </div>
  }
}
