import React from 'react'
import classNames from 'classnames'
import ContentElementControl from './lib/contentElementControl'
import CustomContentElementControl from './lib/customContentElementControl'
import vcCake from 'vc-cake'
const cook = vcCake.getService('cook')
// const categories = vcCake.getService('categories')
const hubCategoriesService = vcCake.getService('hubCategories')

export default class BlankPage extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    controlsData: React.PropTypes.object
  }

  static defaultProps = {
    controlsData: {
      elementControls: [
        'row', 'textBlock', 'basicButton', 'singleImage', 'youtubePlayer'
      ],
      addControl: {
        title: 'Add Element',
        classSuffix: 'add',
        description: `Access list of all your content elements available in 'Add Element' window. For additional content, visit Visual Composer Hub to download more elements.`
      },
      templateControl: {
        title: 'Template',
        classSuffix: 'template',
        description: 'Select ready to use a template with default (replaceable) content elements to fasten up building process. For additional content, visit Visual Composer Hub to download more templates.'
      }
    }
  }

  constructor (props) {
    super(props)
    this.handleElementControl = this.handleElementControl.bind(this)
    this.handleAddElementControl = this.handleAddElementControl.bind(this)
    this.handleTemplateControl = this.handleTemplateControl.bind(this)
    this.setActiveControl = this.setActiveControl.bind(this)
    this.unsetActiveControl = this.unsetActiveControl.bind(this)
    this.state = {
      isActiveDescription: false,
      description: null
    }
  }

  setActiveControl (description) {
    this.setState({
      description: description || '',
      isActiveDescription: true
    })
  }

  unsetActiveControl () {
    this.setState({
      isActiveDescription: false
    })
  }

  handleElementControl (data) {
    this.props.api.request('data:add', data)
    this.props.api.request('app:edit', data.id, '')
  }

  handleAddElementControl (e) {
    e && e.preventDefault()
    this.props.api.request('app:add', '')
  }

  handleTemplateControl (e) {
    e && e.preventDefault()
    this.props.api.request('app:templates', true)
  }

  getControlProps (index, tag) {
    let element = cook.get({ tag: tag })
    if (!element) {
      return null
    }
    let icon = hubCategoriesService.getElementIcon(tag)

    return {
      key: 'vcvBlankPage' + tag + index,
      title: element.get('name'),
      icon: icon,
      classSuffix: tag,
      description: element.get('metaPreviewDescription'),
      index: index,
      setActive: this.setActiveControl,
      unsetActive: this.unsetActiveControl,
      tag: tag,
      handleClick: this.handleElementControl,
      data: element.toJS()
    }
  }

  getElementControls () {
    let { elementControls } = this.props.controlsData
    let allControls = elementControls.map((tag, i) => {
      let controlProps = this.getControlProps(i, tag)
      return controlProps ? <ContentElementControl {...controlProps} /> : null
    })
    allControls.push(<CustomContentElementControl key='vcvBlankPageAddElement'
      setActive={this.setActiveControl} unsetActive={this.unsetActiveControl}
      handleClick={this.handleAddElementControl}
      {...this.props.controlsData.addControl}

    />)
    return allControls
  }

  getTemplateControl () {
    return <CustomContentElementControl key='vcvBlankPageAddTemplate'
      setActive={this.setActiveControl} unsetActive={this.unsetActiveControl}
      handleClick={this.handleTemplateControl}
      {...this.props.controlsData.templateControl}
    />
  }

  render () {
    let elementControls = this.getElementControls()
    let templateControl = this.getTemplateControl()

    let descriptionClass = classNames({
      'vcv-blank-page-description-container': true,
      'vcv-blank-page-description-active': this.state.isActiveDescription
    })

    return (
      <vcvhelper className='vcv-blank-page-container vcv-is-disabled-outline'>
        <div className='vcv-blank-page-heading-container'>
          <span className='vcv-blank-page-heading'>A Blank Page.</span>
          <span className='vcv-blank-page-heading'>Add Your First Content Element or Select A Template.</span>
        </div>
        <div className='vcv-blank-page-controls'>
          <div className='vcv-blank-page-controls-container'>
            <div className='vcv-blank-page-controls-row'>
              {elementControls}
            </div>
            <div className='vcv-blank-page-controls-row'>
              {templateControl}
            </div>
            <div className={descriptionClass}>
              {this.state.description}
            </div>
          </div>
        </div>
      </vcvhelper>
    )
  }
}
