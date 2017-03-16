import React from 'react'
import ElementControl from './lib/elementControl'
import vcCake from 'vc-cake'
const cook = vcCake.getService('cook')

export default class BlankRowPlaceholder extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    controlsData: React.PropTypes.object
  }

  static defaultProps = {
    controlsData: {
      controls: [
        {
          tag: 'row',
          options: {
            layout: ['auto'],
            icon: 'oneColumn.svg',
            title: 'Add one column'
          }
        },
        {
          tag: 'row',
          options: {
            layout: ['1/2', '1/2'],
            icon: 'twoColumns.svg',
            title: 'Add two columns'
          }
        },
        {
          tag: 'row',
          options: {
            layout: ['1/3', '1/3', '1/3'],
            icon: 'threeColumns.svg',
            title: 'Add three columns'
          }
        },
        {
          tag: 'row',
          options: {
            layout: ['1/4', '1/4', '1/4', '1/4'],
            icon: 'fourColumns.svg',
            title: 'Add four columns'
          }
        },
        {
          tag: 'row',
          options: {
            layout: ['1/5', '1/5', '1/5', '1/5', '1/5'],
            icon: 'fiveColumns.svg',
            title: 'Add five columns'
          }
        },
        {
          tag: 'row',
          options: {
            layout: ['2/3', '1/3'],
            icon: 'custom.svg',
            title: 'Add custom columns',
            type: 'custom'
          }
        },
        {
          tag: 'textBlock',
          options: {
            icon: 'textBlock.svg',
            title: 'Add text block'
          }
        },
        {
          tag: 'addElement',
          options: {
            icon: 'addElement.svg',
            title: 'Add element'
          }
        }
      ]
    }
  }

  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleElementControl (element) {
    this.props.api.request('data:add', element)
  }

  handleElementControlWithForm (element, tab = '') {
    this.props.api.request('data:add', element)
    this.props.api.request('app:edit', element.id, tab)
  }

  handleAddElementControl (e) {
    e && e.preventDefault()
    this.props.api.request('app:add', '')
  }

  handleClick (control) {
    if (control.tag === 'addElement') {
      this.handleAddElementControl()
    }
    if (control.tag === 'textBlock') {
      const element = cook.get({tag: control.tag}).toJS()
      this.handleElementControlWithForm(element)
    }
    if (control.tag === 'row') {
      const layoutData = {
        layoutData: control.options.layout
      }
      const element = cook.get({tag: control.tag, layout: layoutData}).toJS()
      if (control.options.type && control.options.type === 'custom') {
        this.handleElementControlWithForm(element, 'layout')
      } else {
        this.handleElementControl(element)
      }
      console.log(element)
      console.log(control.options.layout)
    }
  }

  getControlProps (control, index) {
    return {
      key: 'vcvBlankRow' + control.tag + index,
      control: control,
      handleClick: this.handleClick
    }
  }

  getElementControls () {
    let { controls } = this.props.controlsData
    return controls.map((control, i) => {
      return <ElementControl {...this.getControlProps(control, i)} />
    })
  }

  render () {
    let elementControls = this.getElementControls()

    return (
      <vcvhelper className='vcv-ui-blank-row-container'>
        <div className='vcv-ui-blank-row-controls-container'>
          {elementControls}
        </div>
      </vcvhelper>
    )
  }
}
