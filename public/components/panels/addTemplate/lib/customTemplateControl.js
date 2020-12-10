import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { getService } from 'vc-cake'

const sharedAssetsLibraryService = getService('sharedAssetsLibrary')
const dataManager = getService('dataManager')

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
    handleRemoveTemplate: PropTypes.func.isRequired
  }

  render () {
    const { name, spinner, handleApplyTemplate, handleRemoveTemplate } = this.props
    const letter = name.charAt(0).toUpperCase()
    const localizations = dataManager.get('localizations')
    const nameClasses = classNames({
      'vcv-ui-item-badge vcv-ui-badge--success': false,
      'vcv-ui-item-badge vcv-ui-badge--warning': false
    })

    const spinnerClasses = classNames({
      'vcv-ui-item-control vcv-ui-icon vcv-ui-wp-spinner-light': true,
      'vcv-ui-state--hidden': !spinner
    })

    const applyClasses = classNames({
      'vcv-ui-item-control vcv-ui-icon vcv-ui-icon-add': true,
      'vcv-ui-state--hidden': spinner
    })

    const removeClasses = classNames({
      'vcv-ui-item-control vcv-ui-icon vcv-ui-icon-close-thin vcv-ui-form-attach-image-item-control-state--danger': true,
      'vcv-ui-state--hidden': spinner
    })

    const overlayClasses = classNames({
      'vcv-ui-item-overlay': true,
      'vcv-ui-item-overlay--visible': spinner
    })

    return (
      <div className='vcv-ui-item-list-item'>
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
                title={localizations.addPlaceholder.replace('%s', name)}
              />
              <span
                className={removeClasses}
                onClick={handleRemoveTemplate}
                title={localizations.removePlaceholder.replace('%s', name)}
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
      </div>
    )
  }
}
