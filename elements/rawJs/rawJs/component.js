import React from 'react'
import { getService } from 'vc-cake'

const vcvAPI = getService('api')

export default class RawJs extends vcvAPI.elementComponent {
  componentDidMount () {
    this.props.editor && this.updateJsScript(this.props.atts.rawJs)
  }

  /* eslint-disable */
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.props.atts.rawJs !== nextProps.atts.rawJs) {
      this.props.editor && this.updateJsScript(nextProps.atts.rawJs)
    }
  }

  /* eslint-enable */

  updateJsScript (rawJs) {
    const component = this.refs.rawJsWrapper
    this.updateInlineScript(component, rawJs)
  }

  render () {
    const { id, atts, editor } = this.props
    const { customClass, metaCustomId } = atts // destructuring assignment for attributes from settings.json with access public
    let classes = 'vce-raw-js-container'
    const customProps = {}
    const wrapperClasses = 'vce-raw-js-wrapper'
    if (typeof customClass === 'string' && customClass) {
      classes = classes.concat(' ' + customClass)
    }

    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    const doAll = this.applyDO('all')

    return (
      <div className={classes} {...editor} {...customProps}>
        <div className={wrapperClasses} id={'el-' + id} {...doAll} ref='rawJsWrapper' />
      </div>
    )
  }
}
