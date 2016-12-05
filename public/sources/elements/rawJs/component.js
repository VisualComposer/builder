/* global React, vcvAPI */
class Component extends vcvAPI.elementComponent {
  componentDidMount () {
    this.props.editor && this.updateJsScript(this.props.atts.rawJs)
  }
  componentWillReceiveProps (nextProps) {
    this.props.editor && this.updateJsScript(nextProps.atts.rawJs)
  }
  updateJsScript (rawJs) {
    let component = this.refs.rawJsWrapper
    component.innerHTML = ''
    let script = document.createElement('script')
    script.innerText = rawJs
    component.appendChild(script)
  }
  render () {
    var {id, atts, editor} = this.props
    var {customClass, rawJs} = atts // destructuring assignment for attributes from settings.json with access public
    let classes = 'vce-raw-js-container'
    let wrapperClasses = 'vce-raw-js-wrapper'
    if (typeof customClass === 'string' && customClass) {
      classes = classes.concat(' ' + customClass)
    }
    return <div className={classes} {...editor}>
      <div className={wrapperClasses} id={'el-' + id} ref='rawJsWrapper'>
        <script>{rawJs}</script>
      </div>
    </div>
  }

}
