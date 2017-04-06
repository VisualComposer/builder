import React from 'react'
import vcCake from 'vc-cake'
import BlankControl from './lib/blankControl'
const templateManager = vcCake.getService('myTemplates')

export default class startBlank extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired
  }

  static defaultProps = {
    startBlankTemplates: templateManager.getAllTemplates()
  }

  handleControlClick () {

  }

  getTemplateControlProps (template) {
    return {
      api: this.props.api,
      key: 'vcv-element-control-' + template.id,
      addClick: this.handleControlClick,
      ...template
    }
  }

  getAllBlankControls () {
    return startBlank.defaultProps.startBlankTemplates.map((template) => {
      return this.getBlankControl(template)
    })
  }

  getBlankControl (template) {
    return <BlankControl {...this.getTemplateControlProps(template)} />
  }

  render () {
    return (
      <div className='vcv-start-blank-container'>
        <div className='vcv-start-blank-scroll-container'>
          <div className='vcv-start-blank-inner'>
            <a className='vcv-start-blank-close' href='#' title='Close'>
              <i className='vcv-start-blank-close-icon vcv-ui-icon vcv-ui-icon-close-thin' />
            </a>
            <div className='vcv-start-blank-heading-container'>
              <span className='vcv-start-blank-page-heading'>Select Blank Canvas<br /> or Start With a Template</span>
            </div>
            <div className='vcv-start-blank-item-list-container'>
              <ul className='vcv-ui-item-list'>
                {this.getAllBlankControls()}
              </ul>
            </div>
            <button className='vcv-start-blank-button' disabled>Premium templates- coming soon</button>
            <p className='vcv-start-blank-helper'>
              Visual Composer Hub will offer you unlimited download of premium quality templates, elements, extensions
              and more.
            </p>
          </div>
        </div>
      </div>
    )
  }
}
