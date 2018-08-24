import React from 'react'
import migrateIcon from 'public/sources/images/migrate-icon.png'

export default class PopupComponent extends React.Component {
  closePopup (e) {
    this.props.close()
  }

  backToWordpress (e) {
    window.location.href = window.vcvPostData.backendEditorUrl
  }

  render () {
    return <div className='vcv-migration-notice'>
      <img className='vcv-migration-image' src={migrateIcon} alt='Migrate' />
      <h1 className='vcv-migration-title'>WPBakery Page Builder Layout Detected</h1>
      <p className='vcv-migration-description'>In order to proceed with the Website Builder, you will need to migrate your layout. Basic elements of the page builder will be replaced with the elements of the website builder, the rest of the elements will be replaced with the Shortcode Element.</p>
      <p className='vcv-migration-description'>Migration may result in style changes, we highly recommend to create a backup copy of your site before the migration. Upon save, you will be asked to confirm or revert migration results.</p>
      <input className='vcv-migration-checkbox' type='checkbox' id='vcv-migration-checkbox' />
      <label className='vcv-migration-label' htmlFor='vcv-migration-checkbox'>I understand and accept the process of migration</label>
      <button className='vcv-migration-button vcv-migration-button--start' onClick={this.closePopup.bind(this)}>Start migration</button>
      <button className='vcv-migration-button vcv-migration-button--back' onClick={this.backToWordpress.bind(this)}>Back to wordpress</button>
    </div>
  }
}
