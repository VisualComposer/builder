/* global React, vcvAPI */
/*eslint no-unused-vars: 0*/
class Component extends vcvAPI.elementComponent {
  render () {
    var {id, atts, editor} = this.props
    var {output, customClass} = atts // destructuring assignment for attributes from settings.json with access public
    let textBlockClasses = 'vce-text-block vce'
    if (typeof customClass === 'string' && customClass) {
      textBlockClasses = textBlockClasses.concat(' ' + customClass)
    }
    return <div className={textBlockClasses} {...editor} id={'el-' + id}>
      {output}
    </div>

  }
}