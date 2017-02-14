/* global React, vcvAPI */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  render () {
    let {id, atts, editor} = this.props
    let {output, customClass, metaCustomId} = atts // destructuring assignment for attributes from settings.json with access public
    let textBlockClasses = 'vce-text-block'
    let wrapperClasses = 'vce-text-block-wrapper vce'
    let customProps = {}
    if (typeof customClass === 'string' && customClass) {
      textBlockClasses = textBlockClasses.concat(' ' + customClass)
    }

    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    let doAll = this.applyDO('all')

    return <div className={textBlockClasses} {...editor} {...customProps}>
      <div className={wrapperClasses} id={'el-' + id} {...doAll}>
        {output}
      </div>
    </div>
  }
}
