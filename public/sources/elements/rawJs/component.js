/* global React, vcvAPI */
class Component extends vcvAPI.elementComponent {
  render () {
    var {id, atts, editor} = this.props
    var {customClass} = atts // destructuring assignment for attributes from settings.json with access public
    let classes = 'vce-raw-js'
    let customProps = {}
    if (typeof customClass === 'string' && customClass) {
      classes = classes.concat(' ' + customClass)
    }

    return <div className={classes} {...editor} {...customProps} id={'el-' + id}>
      <p>Enter your js here!</p>
    </div>
  }
}
