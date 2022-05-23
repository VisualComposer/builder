import React from 'react'
import vcCake from 'vc-cake'

const vcvAPI = vcCake.getService('api')

export default class RawHtmlElement extends vcvAPI.elementComponent {
  constructor(props) {
    super(props)
    this.rawHtmlWrapper = React.createRef()
  }

  componentDidMount () {
    this.props.editor && this.updateHtml(this.props.atts.rawHtml)
  }

  componentDidUpdate (prevProps) {
    if (prevProps.atts.rawHtml !== this.props.atts.rawHtml) {
      this.props.editor && this.updateHtml(this.props.atts.rawHtml)
    }
  }

  updateHtml (rawJs) {
    const component = this.rawHtmlWrapper.current
    this.updateInlineHtml(component, rawJs)
  }

  render () {
    const { id, atts, editor } = this.props
    const { customClass, metaCustomId } = atts // destructuring assignment for attributes from settings.json with access public
    let classes = 'vce-raw-html'
    const customProps = {}
    const wrapperClasses = 'vce-raw-html-wrapper'
    if (typeof customClass === 'string' && customClass) {
      classes = classes.concat(' ' + customClass)
    }

    if (metaCustomId) {
      customProps.id = metaCustomId
    }
    const doAll = this.applyDO('all')

    return (
      <div className={classes} {...editor} {...customProps}>
        <div className={wrapperClasses} id={'el-' + id} {...doAll} ref={this.rawHtmlWrapper} />
      </div>
    )
  }
}
