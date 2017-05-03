import React from 'react'
import vcCake from 'vc-cake'
const vcvAPI = vcCake.getService('api')
const cook = vcCake.getService("cook")

export default class RawJs extends vcvAPI.elementComponent {
  componentDidMount () {
    this.props.editor && this.updateJsScript(this.props.atts.rawJs)
  }

  componentWillReceiveProps (nextProps) {
    this.props.editor && this.updateJsScript(nextProps.atts.rawJs)
  }

  updateJsScript (rawJs) {
    let component = this.refs.rawJsWrapper
    component.innerHTML = ''
    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.text = rawJs
    component.appendChild(script)
  }

  render () {
    let { id, atts, editor } = this.props
    let { customClass, rawJs, metaCustomId } = atts // destructuring assignment for attributes from settings.json with access public
    let classes = 'vce-raw-js-container'
    let customProps = {}
    let wrapperClasses = 'vce-raw-js-wrapper'
    if (typeof customClass === 'string' && customClass) {
      classes = classes.concat(' ' + customClass)
    }

    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    let doAll = this.applyDO('all')

    let vcvHelperHTML = `<script>${rawJs}</script>`

    return <div className={classes} {...editor} {...customProps}>
      <div className={wrapperClasses} id={'el-' + id} {...doAll}>
        <vcvhelper
          data-vcvs-html={`[vcv_encoded_shortcode]${encodeURIComponent(btoa(vcvHelperHTML))}[/vcv_encoded_shortcode]`} ref='rawJsWrapper' />
      </div>
    </div>
  }

}
