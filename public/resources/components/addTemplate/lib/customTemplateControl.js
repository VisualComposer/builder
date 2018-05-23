import vcCake from 'vc-cake'
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const sharedAssetsLibraryService = vcCake.getService('sharedAssetsLibrary')

export default class CustomTemplateControl extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    applyTemplate: PropTypes.func.isRequired,
    removeTemplate: PropTypes.func.isRequired,
    spinner: PropTypes.bool,
    type: PropTypes.string,
    description: PropTypes.string,
    preview: PropTypes.string,
    thumbnail: PropTypes.string,
    handleApplyTemplate: PropTypes.func.isRequired,
    handleRemoveTemplate: PropTypes.func.isRequired,
    addTemplateText: PropTypes.string,
    removeTemplateText: PropTypes.string
  }

  constructor (props) {
    super(props)
    this.state = {
      letter: this.props.name.charAt(0).toUpperCase()
    }
  }

  render () {
    const { name, spinner, addTemplateText, removeTemplateText, handleApplyTemplate, handleRemoveTemplate } = this.props
    const { letter } = this.state

    let nameClasses = classNames({
      'vcv-ui-item-badge vcv-ui-badge--success': false,
      'vcv-ui-item-badge vcv-ui-badge--warning': false
    })

    let spinnerClasses = classNames({
      'vcv-ui-item-control vcv-ui-icon vcv-ui-wp-spinner-light': true,
      'vcv-ui-state--hidden': !spinner
    })

    let applyClasses = classNames({
      'vcv-ui-item-control vcv-ui-icon vcv-ui-icon-add': true,
      'vcv-ui-state--hidden': spinner
    })

    let removeClasses = classNames({
      'vcv-ui-item-control vcv-ui-icon vcv-ui-icon-close-thin vcv-ui-form-attach-image-item-control-state--danger': true,
      'vcv-ui-state--hidden': spinner
    })

    let overlayClasses = classNames({
      'vcv-ui-item-overlay': true,
      'vcv-ui-item-overlay--visible': spinner
    })

    return (
      <li className='vcv-ui-item-list-item'>
        <span className='vcv-ui-item-element'>
          <span
            className='vcv-ui-item-element-content'
            data-letter={letter}
          >
            <img
              className='vcv-ui-item-element-image'
              src={sharedAssetsLibraryService.getSourcePath('images/template-thumbnail.png')}
              alt={name}
            />
            <span className={overlayClasses}>
              <span
                className={applyClasses}
                onClick={handleApplyTemplate}
                title={addTemplateText}
              />
              <span
                className={removeClasses}
                onClick={handleRemoveTemplate}
                title={removeTemplateText}
              />
              <span className={spinnerClasses} />
            </span>
          </span>
          <span className='vcv-ui-item-element-name'>
            <span className={nameClasses}>
              {name}
            </span>
          </span>
        </span>
      </li>
    )
  }
}
