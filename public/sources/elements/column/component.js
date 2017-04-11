/* global React, vcvAPI */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  getContent (doBoxModel, innerProps) {
    let rowProps = vcCake.getService('document').get(this.props.atts.parent)
    let content = this.props.children
    let contentContainer = ''

    if (rowProps.contentPosition === 'top') {
      contentContainer = (
        <div className='vce-col-inner' {...innerProps} {...doBoxModel}>
          {content}
        </div>
      )
    } else {
      contentContainer = (
        <div className='vce-col-inner' {...innerProps} {...doBoxModel}>
          <div className='vce-col-content'>
            {content}
          </div>
        </div>
      )
    }
    return contentContainer
  }

  render () {
    // import variables
    let { id, atts, editor } = this.props
    let { size, customClass, metaCustomId, designOptionsAdvanced, lastInRow, firstInRow } = atts

    // import template js
    const classNames = require('classnames')
    let customColProps = {}
    let innerProps = {}
    let classes = []

    classes = [ 'vce-col' ]
    classes.push('vce-col--md-' + (size ? size.replace('/', '-').replace('%', 'p').replace(',', '-').replace('.', '-') : 'auto'))
    classes.push('vce-col--xs-1 vce-col--xs-last vce-col--xs-first vce-col--sm-last vce-col--sm-first')
    classes.push(this.getBackgroundClass(designOptionsAdvanced))

    if (lastInRow) {
      classes.push('vce-col--md-last vce-col--lg-last vce-col--xl-last')
    }

    if (firstInRow) {
      classes.push('vce-col--md-first vce-col--lg-first vce-col--xl-first')
    }

    if (typeof customClass === 'string' && customClass.length) {
      classes.push(customClass)
    }

    let className = classNames(classes)
    if (metaCustomId) {
      innerProps.id = metaCustomId
    }

    let doBoxModel = this.applyDO('margin padding border animation background')

    // import template
    return (<div className={className} {...customColProps} id={'el-' + id} {...editor}>
      {this.getBackgroundTypeContent()}
      {this.getContent(doBoxModel, innerProps)}
    </div>)
  }
}
