/* global React, vcvAPI */
/*eslint no-unused-vars: 0*/
class Component extends vcvAPI.elementComponent {
  render () {
    var {id, atts, editor} = this.props
    var {} = atts // destructuring assignment for attributes from settings.json with access public
    let containerClasses = ''
    return <div className={containerClasses} id={'el-' + id} {...editor}>
      {this.getContent()}
    </div>
  }
}

