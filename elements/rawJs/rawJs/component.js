import React from 'react'
import { getService } from 'vc-cake'

const vcvAPI = getService('api')

export default class RawJs extends vcvAPI.elementComponent {
  constructor (props) {
    super(props)
    this.rawJsWrapper = React.createRef()
  }

  componentDidMount () {
    this.props.editor && this.updateJsScript(this.props.atts.rawJs)
  }

  componentDidUpdate (prevProps) {
    if (prevProps.atts.rawJs !== this.props.atts.rawJs) {
      this.props.editor && this.updateJsScript(this.props.atts.rawJs)
    }
  }

  updateJsScript (rawJs) {
    const component = this.rawJsWrapper.current
    this.updateInlineScript(component, rawJs)
  }

  render () {
    const { id, atts, editor } = this.props
    const { customClass, metaCustomId, extraDataAttributes } = atts // destructuring assignment for attributes from settings.json with access public
    let classes = 'vce-raw-js-container'
    const customProps = this.getExtraDataAttributes(extraDataAttributes)
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
        <div className={wrapperClasses} id={'el-' + id} {...doAll} ref={this.rawJsWrapper} />
      </div>
    )
  }
}
