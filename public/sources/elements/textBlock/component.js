import Element from '../element'

export default class Component extends Element {
  render () {
    let {atts: {output}, editor} = this.props
    return <div className='vce-text-block' {...editor}>
      {output}
    </div>
  }
}
