import React from 'react'
import vcCake from 'vc-cake'
const vcvAPI = vcCake.getService('api')

export default class RawHtmlElement extends vcvAPI.elementComponent {
  componentDidMount () {
    this.props.editor && this.updateHtml(this.props.atts.rawHtml)
  }

  /* eslint-disable */
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.props.atts.rawHtml !== nextProps.atts.rawHtml) {
      this.props.editor && this.updateHtml(nextProps.atts.rawHtml)
    }
  }
  /* eslint-enable */

  updateHtml (rawJs) {
    let component = this.refs.rawHtmlWrapper
    this.updateInlineHtml(component, rawJs)
  }

  render () {
    let { id, atts, editor } = this.props
    let { customClass, metaCustomId } = atts // destructuring assignment for attributes from settings.json with access public
    let classes = 'vce-raw-html'
    let customProps = {}
    let wrapperClasses = 'vce-raw-html-wrapper'
    if (typeof customClass === 'string' && customClass) {
      classes = classes.concat(' ' + customClass)
    }

    if (metaCustomId) {
      customProps.id = metaCustomId
    }
    let doAll = this.applyDO('all')

    return <div className={classes} {...editor} {...customProps}>
      <div className={wrapperClasses} id={'el-' + id} {...doAll} ref='rawHtmlWrapper' />
    </div>
  }
}
