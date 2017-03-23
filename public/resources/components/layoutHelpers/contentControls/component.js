import React from 'react'
import RowControl from './lib/rowControl'
import vcCake from 'vc-cake'

export default class ContentControls extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    id: React.PropTypes.string.isRequired,
    controlsData: React.PropTypes.array
  }

  static defaultProps = {
    controlsData: [
      {
        icon: 'addElement.svg',
        title: 'Add Element',
        action: 'app:add'
      }
    ]
  }

  getControls () {
    const element = vcCake.getService('document').get(this.props.id)
    let addElementTag = ''
    const children = vcCake.getService('cook').getChildren(element.tag)
    if (children.length === 1) {
      addElementTag = children[0].tag
    }
    return this.props.controlsData.map((control, i) => {
      return <RowControl
        key={`vcvRowControlItem${i}`}
        api={this.props.api}
        id={this.props.id}
        title={control.title}
        icon={control.icon}
        action={control.action}
        options={addElementTag}
      />
    })
  }

  render () {
    return <vcvhelper className='vcv-row-control-container vcv-row-control-container-hide-labels'>
      {this.getControls()}
    </vcvhelper>
  }
}
