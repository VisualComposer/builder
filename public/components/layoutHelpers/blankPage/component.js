import React from 'react'
import classNames from 'classnames'
import ContentElementControl from './lib/contentElementControl'
import CustomContentElementControl from './lib/customContentElementControl'
import vcCake from 'vc-cake'
import PropTypes from 'prop-types'

const cook = vcCake.getService('cook')
const hubElementsService = vcCake.getService('hubElements')

export default class BlankPage extends React.Component {
  static propTypes = {
    api: PropTypes.object.isRequired,
    controlsData: PropTypes.object
  }

  static defaultProps = {
    controlsData: {
      elementControls: [
        'row', 'textBlock', 'basicButton', 'singleImage', 'youtubePlayer'
      ],
      addControl: {
        title: 'Add Element',
        classSuffix: 'add',
        description: 'Access list of all your content elements available in \'Add Element\' window. For additional content, visit Visual Composer Hub to download more elements.'
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
    this.handleClickAddElementControl = this.handleClickAddElementControl.bind(this)
    this.handleClickTemplateControl = this.handleClickTemplateControl.bind(this)
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

  handleClickAddElementControl (e) {
    e && e.preventDefault()
    this.props.api.request('app:add', '')
  }

  handleClickTemplateControl (e) {
    e && e.preventDefault()
    this.props.api.request('app:templates', true)
  }

  getControlProps (index, tag) {
    const element = cook.get({ tag: tag })
    if (!element) {
      return null
    }
    const icon = hubElementsService.getElementIcon(tag)

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
      onClick: this.handleElementControl,
      data: element.toJS()
    }
  }

  getElementControls () {
    const { elementControls } = this.props.controlsData
    const allControls = elementControls.map((tag, i) => {
      const controlProps = this.getControlProps(i, tag)
      return controlProps ? <ContentElementControl {...controlProps} /> : null
    })
    allControls.push(
      <CustomContentElementControl
        key='vcvBlankPageAddElement'
        setActive={this.setActiveControl} unsetActive={this.unsetActiveControl}
        onClick={this.handleClickAddElementControl}
        {...this.props.controlsData.addControl}
      />
    )
    return allControls
  }

  getTemplateControl () {
    return (
      <CustomContentElementControl
        key='vcvBlankPageAddTemplate'
        setActive={this.setActiveControl} unsetActive={this.unsetActiveControl}
        onClick={this.handleClickTemplateControl}
        {...this.props.controlsData.templateControl}
      />
    )
  }

  render () {
    const elementControls = this.getElementControls()
    const templateControl = this.getTemplateControl()

    const descriptionClass = classNames({
      'vcv-blank-page-description-container': true,
      'vcv-blank-page-description-active': this.state.isActiveDescription
    })

    return (
      <div className='vcvhelper vcv-blank-page-container vcv-is-disabled-outline'>
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
      </div>
    )
  }
}
