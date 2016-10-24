/* global React, vcvAPI */
class Component extends vcvAPI.elementComponent {
  componentDidMount () {
    this.props.editor && this.updateJsScript(this.props.atts.rawJs)
  }
  componentWillReceiveProps (nextProps) {
    this.props.editor && this.updateJsScript(nextProps.atts.rawJs)
  }
  updateJsScript (rawJs) {
    const ReactDOM = require('react-dom')
    let component = ReactDOM.findDOMNode(this)
    component.innerHTML = ''
    let script = document.createElement('script')
    script.innerText = rawJs
    component.appendChild(script)
  }
  render () {
    var {id, atts, editor} = this.props
    var {customClass, rawJs} = atts // destructuring assignment for attributes from settings.json with access public
    let classes = 'vce-raw-js-container'
    if (typeof customClass === 'string' && customClass) {
      classes = classes.concat(' ' + customClass)
    }
    return <div id={'el-' + id} className={classes} {...editor}>
      <script>{rawJs}</script>
    </div>
  }

}
