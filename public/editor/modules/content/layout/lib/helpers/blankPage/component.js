import React from 'react'
import classNames from 'classnames'
import ContentElementControl from './lib/contentElementControl'
import CustomContentElementControl from './lib/customContentElementControl'
import vcCake from 'vc-cake'
const cook = vcCake.getService('cook')
const categories = vcCake.getService('categories')

export default class BlankPage extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    layoutData: React.PropTypes.object,
    controlsData: React.PropTypes.object
  }

  static defaultProps = {
    layoutData: {
      getData () {
        this.innerDoc = document.getElementById('vcv-editor-iframe').contentWindow.document
        this.blankPageContainer = this.innerDoc.querySelector('.vcv-blank-page-container')
        this.controlsContainer = this.blankPageContainer.querySelector('.vcv-blank-page-controls')
        this.rowContainer = this.blankPageContainer.querySelector('.vcv-blank-page-controls-container')
        this.controlRows = this.rowContainer.querySelectorAll('.vcv-blank-page-controls-row')
        this.controlRow = this.rowContainer.querySelector('.vcv-blank-page-controls-row')
        this.controls = this.controlRow.children
        this.contolStyle = document.getElementById('vcv-editor-iframe').contentWindow.getComputedStyle(this.controls[0])
        this.controlMargins = parseFloat(this.contolStyle['marginLeft']) + parseFloat(this.contolStyle['marginRight'])
        this.controlWidth = this.controls[0].offsetWidth + this.controlMargins
      }
    },
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
    this.setControlsLayout = this.setControlsLayout.bind(this)
    this.handleElementControl = this.handleElementControl.bind(this)
    this.handleAddElementControl = this.handleAddElementControl.bind(this)
    this.handleTemplateControl = this.handleTemplateControl.bind(this)
    this.state = {
      lockWidth: false,
      minElementsCount: 4,
      isActiveDescription: false,
      description: null
    }
  }

  componentDidMount () {
    this.props.layoutData.getData()
    this.setControlsLayout()
  }

  componentWillMount () {
    document.getElementById('vcv-editor-iframe').contentWindow.addEventListener('resize', this.setControlsLayout)
  }

  componentWillUnmount () {
    document.getElementById('vcv-editor-iframe').contentWindow.removeEventListener('resize', this.setControlsLayout)
  }

  getContainerWidth () {
    let { controlsContainer, controlMargins } = this.props.layoutData
    let computedStyles = document.querySelector('#vcv-editor-iframe').contentWindow.getComputedStyle(controlsContainer)
    return parseFloat(computedStyles.width) + controlMargins
  }

  getMaxElementsData () {
    let containerWidth = this.getContainerWidth()
    let controlWidth = this.props.layoutData.controlWidth
    let elementsCount = Math.floor(containerWidth / controlWidth)
    let elementsWidth = elementsCount * controlWidth
    return {
      elementsCount: elementsCount,
      elementsWidth: elementsWidth
    }
  }

  setControlsLayout () {
    let {elementsCount, elementsWidth} = this.getMaxElementsData()
    let { controlMargins, rowContainer, controlRows } = this.props.layoutData
    if (elementsCount < this.state.minElementsCount) {
      for (let i in controlRows) {
        if (controlRows.hasOwnProperty(i)) {
          controlRows[i].classList.add('vcv-ui-element-controls--lock-width')
        }
      }
      rowContainer.style.maxWidth = false
    } else {
      for (let i in controlRows) {
        if (controlRows.hasOwnProperty(i)) {
          controlRows[i].classList.remove('vcv-ui-element-controls--lock-width')
        }
      }
      rowContainer.style.maxWidth = elementsWidth - controlMargins + 'px'
    }
  }

  setActiveControl = (description) => {
    this.setState({
      description: description || '',
      isActiveDescription: true
    })
  }

  unsetActiveControl = () => {
    this.setState({
      isActiveDescription: false
    })
  }

  handleElementControl (data) {
    this.props.api.request('data:add', data)
  }

  handleAddElementControl () {
    this.props.api.request('app:add', '')
  }

  handleTemplateControl () {
    this.props.api.request('app:templates', true)
  }

  getControlProps (index, tag) {
    let element = cook.get({tag: tag})
    let icon = categories.getElementIcon(tag)
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
    let {elementControls} = this.props.controlsData
    let allControls = elementControls.map((tag, i) => {
      return <ContentElementControl {...this.getControlProps(i, tag)} />
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
      <vcvhelper className='vcv-blank-page-container'>
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
