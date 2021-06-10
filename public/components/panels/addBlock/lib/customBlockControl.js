import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { getService } from 'vc-cake'

const dataManager = getService('dataManager')
const roleManager = getService('roleManager')

export default class CustomBlockControl extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    applyBlock: PropTypes.func.isRequired,
    removeBlock: PropTypes.func.isRequired,
    spinner: PropTypes.bool,
    type: PropTypes.string,
    description: PropTypes.string,
    preview: PropTypes.string,
    thumbnail: PropTypes.string,
    handleApplyBlock: PropTypes.func.isRequired,
    handleRemoveBlock: PropTypes.func.isRequired
  }

  render () {
    const { name, spinner, handleApplyBlock, handleRemoveBlock } = this.props
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
      'vcv-ui-item-overlay--visible': spinner,
      'vcv-ui-item-control--visible': this.props.isRemoveStateActive
    })

    const overlayProps = {}
    let itemButton = null
    const isAbleToRemove = roleManager.can('editor_content_user_blocks_management', roleManager.defaultTrue())
    if (this.props.isRemoveStateActive) {
      if (isAbleToRemove) {
        itemButton = (
          <span
            className={removeClasses}
            title={localizations.removePlaceholder.replace('%', name)}
          />
        )
      } else {
        overlayProps.style = {
          cursor: 'not-allowed'
        }
      }
    } else {
      const isAbleToAdd = roleManager.can('editor_content_template_add', roleManager.defaultTrue())
      if (isAbleToAdd) {
        itemButton = (
          <span
            className={applyClasses}
            title={localizations.addPlaceholder.replace('%', name)}
          />
        )
      } else {
        overlayProps.style = {
          cursor: 'not-allowed'
        }
      }
    }

    return (
      <div className='vcv-ui-item-list-item'>
        <span
          className='vcv-ui-item-element'
          onClick={this.props.isRemoveStateActive && isAbleToRemove ? handleRemoveBlock : handleApplyBlock}
        >
          <span
            className='vcv-ui-item-element-content vcv-ui-item-element-constant-bg'
            data-letter={letter}
          >
            <span className={overlayClasses} {...overlayProps}>
              {itemButton}
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
