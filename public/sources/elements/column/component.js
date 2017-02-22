/* global React, vcvAPI */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  render () {
    // import variables
    let { id, atts, editor } = this.props
    let { size, customClass, metaCustomId, designOptionsAdvanced } = atts
    let content = this.props.children

    // import template js
    const classNames = require('classnames')
    let customProps = {}
    let customColProps = {}
    let classes = []

    if (vcCake.env('FEATURE_CUSTOM_ROW_LAYOUT')) {
      classes = [ 'vce-col' ]
      classes.push('vce-col--' + (size ? size.replace('/', '-') : 'auto'))
      classes.push(this.getBackgroundClass(designOptionsAdvanced))
    } else {
      classes = [ 'vce-col', 'vce-col--xs-1' ]
      classes.push('vce-col--sm-' + (size ? size.replace('/', '-') : 'auto'))
    }

// reverse classes.push('vce-row-wrap--reverse')
    if (typeof customClass === 'string' && customClass.length) {
      classes.push(customClass)
    }

    let className = classNames(classes)
    if (metaCustomId) {
      customColProps.id = metaCustomId
    }

    let doBoxModel = this.applyDO('margin padding border animation background')

    // import template
    return (<div className={className} {...customColProps} id={'el-' + id} {...editor} {...doBoxModel}>
      {this.getBackgroundTypeContent()}
      <div className='vce-col-inner'>
        <div className='vce-col-content' {...customProps}>
          {content}
        </div>
      </div>
    </div>)
  }
}
