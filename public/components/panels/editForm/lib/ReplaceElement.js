/* eslint react/jsx-no-bind:"off" */
import React from 'react'
import classNames from 'classnames'
import vcCake from 'vc-cake'
import PropTypes from 'prop-types'

const Cook = vcCake.getService('cook')
const hubCategoriesService = vcCake.getService('hubCategories')

export default class ElementAttribute extends React.Component {
  static propTypes = {
    updater: PropTypes.func.isRequired,
    tag: PropTypes.string.isRequired,
    element: PropTypes.object.isRequired,
    options: PropTypes.any
  }

  constructor (props) {
    super(props)
    this.state = {
      showReplacements: false
    }
    this.handleReplace = this.handleReplace.bind(this)
    this.toggleReplace = this.toggleReplace.bind(this)
  }

  handleReplace (newElementTag, cookElement) {
    this.props.updater(newElementTag, cookElement)
  }

  toggleReplace () {
    this.setState({ showReplacements: !this.state.showReplacements })
  }

  getReplacements (categorySettings) {
    return categorySettings.elements.map((tag) => {
      let cookElement = Cook.get({ tag: tag })
      if (!cookElement || !cookElement.get('name') || cookElement.get('name') === '--') {
        return null
      }
      let nameClasses = classNames({
        'vcv-ui-item-badge vcv-ui-badge--success': false,
        'vcv-ui-item-badge vcv-ui-badge--warning': false
      })
      let itemContentClasses = classNames({
        'vcv-ui-item-element-content': true,
        'vcv-ui-item-list-item-content--active': this.props.tag === tag
      })

      let publicPathThumbnail = cookElement.get('metaThumbnailUrl')

      return (
        <li key={'vcv-replace-element-' + cookElement.get('tag')} className='vcv-ui-item-list-item'>
          <span
            className='vcv-ui-item-element'
            onClick={this.handleReplace.bind(this, tag, cookElement)}
          >
            <span className={itemContentClasses}>
              <img className='vcv-ui-item-element-image' src={publicPathThumbnail}
                alt={cookElement.get('name')} />
              <span className='vcv-ui-item-overlay'>
                <span className='vcv-ui-item-add vcv-ui-icon vcv-ui-icon-add' />
              </span>
            </span>
            <span className='vcv-ui-item-element-name'>
              <span className={nameClasses}>
                {cookElement.get('name')}
              </span>
            </span>
          </span>
        </li>
      )
    })
  }

  render () {
    const { options } = this.props
    const { category, elementLabel } = options
    const { showReplacements } = this.state
    let replacements = ''
    let categorySettings = hubCategoriesService.get(category)
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const replaceElementText = localizations ? localizations.replaceElementEditForm : 'Replace current element with different element from the same category'

    if (categorySettings && showReplacements) {
      let replacementItemsOutput = this.getReplacements(categorySettings)
      replacements = (
        <div className='vcv-ui-replace-element-container'>
          <span className='vcv-ui-replace-element-hide' title='Close' onClick={this.toggleReplace}>
            <i className='vcv-layout-bar-content-hide-icon vcv-ui-icon vcv-ui-icon-close-thin' />
          </span>
          <ul className='vcv-ui-replace-element-list'>
            {replacementItemsOutput}
          </ul>
        </div>
      )
    } else {
      replacements = (
        <div>
          <p className='vcv-ui-form-helper'>
            {replaceElementText}
          </p>
          <button type='button' className='vcv-ui-form-button vcv-ui-form-button--default'
            onClick={this.toggleReplace}>
            Replace {elementLabel}
          </button>
        </div>
      )
    }

    return (
      <div className='vcv-ui-form-element'>
        <div className='vcv-ui-replace-element-block'>
          {replacements}
        </div>
      </div>
    )
  }
}
