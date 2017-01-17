import React from 'react'
import classNames from 'classnames'
import { getService } from 'vc-cake'
import '../../../../../sources/less/wpbackend/representers/init.less'

const categories = getService('categories')
const cook = getService('cook')

export default class DefaultElement extends React.Component {
  static propTypes = {
    element: React.PropTypes.object.isRequired,
    api: React.PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      activeElement: true,
      activeAttribute: false,
      element: props.element
    }
    this.handleClick = this.handleClick.bind(this)
  }

  componentWillMount () {
    let cookElement = cook.get({ tag: this.state.element.tag })
    if (!cookElement.get('metaBackendLabels')) {
      this.setState({ activeElement: false })
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ element: nextProps })
  }

  handleClick () {
    this.setState({ activeAttribute: !this.state.activeAttribute })
  }

  getRepresenter (element) {
    let cookElement = cook.get({tag: element.tag})
    let backendLabels = cookElement.get('metaBackendLabels').value
    let representers = []
    backendLabels.forEach((label) => {
      let RepresenterComponent = cookElement.settings(label).type.getRepresenter('Backend')
      representers.push(
        <RepresenterComponent
          key={`representer-${label}-${cookElement.get('id')}`}
          fieldKey={label}
          value={element[label]}
          {...this.props}
        />
      )
    })
    return representers
  }

  render () {
    const { element, activeAttribute, activeElement } = this.state
    let icon = categories.getElementIcon(element.tag, true)
    let attributesClasses = classNames({
      'vce-wpbackend-element-attributes': true,
      'vce-wpbackend-hidden': !activeAttribute
    })

    let headerClasses = classNames({
      'vce-wpbackend-element-header': true,
      'vce-wpbackend-element-header-closed': !activeAttribute,
      'vce-wpbackend-element-header-opened': activeAttribute
    })

    if (activeElement) {
      return <div className='vce-wpbackend-element-container'>
        <div className={headerClasses} onClick={this.handleClick}>
          <div className='vce-wpbackend-element-header-icon'>
            <img src={icon} alt={element.name} />
          </div>
          <div className='vce-wpbackend-element-header-name'>{element.name}</div>
        </div>
        <div className={attributesClasses}>
          {this.getRepresenter(element)}
        </div>
      </div>
    }
    return <div className='vce-wpbackend-element-container'>
      <div className='vce-wpbackend-element-header'>
        <div className='vce-wpbackend-element-header-icon'>
          <img src={icon} alt={element.name} />
        </div>
        <div className='vce-wpbackend-element-header-name'>{element.name}</div>
      </div>
    </div>
  }
}
