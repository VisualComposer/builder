/* global React, vcvAPI */
class Component extends vcvAPI.elementComponent {
  render () {
    var {id, atts, editor} = this.props
    var {rawJs, customClass} = atts // destructuring assignment for attributes from settings.json with access public
    let classes = 'vce-raw-js'
    let customProps = {}
    if (typeof customClass === 'string' && customClass) {
      classes = classes.concat(' ' + customClass)
    }
    let createMarkup = () => {
      return {__html: rawJs}
    }

    return <div className={classes} {...editor} {...customProps} id={'el-' + id} dangerouslySetInnerHTML={createMarkup()} />
  }
}
