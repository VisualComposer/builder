/* global React, vcvAPI */
class Component extends vcvAPI.elementComponent {
  render () {
    var {id, atts, editor} = this.props
    var {rawHtml, customClass} = atts // destructuring assignment for attributes from settings.json with access public
    let classes = 'vce-raw-html'
    let customProps = {}
    if (typeof customClass === 'string' && customClass) {
      classes = classes.concat(' ' + customClass)
    }
    let createMarkup = () => {
      return {__html: rawHtml}
    }

    return <div className={classes} {...editor} {...customProps} id={'el-' + id} dangerouslySetInnerHTML={createMarkup()} />
  }
}
