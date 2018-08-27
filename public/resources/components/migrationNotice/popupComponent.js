import React from 'react'
import migrateIcon from 'public/sources/images/migrate-icon.png'

export default class PopupComponent extends React.Component {
  clickSkip (e) {
    this.props.close()
  }

  clickDownloadAddon (e) {
    window.alert('TODO')
  }

  render () {
    // TODO: Work in Progress here
    // TODO: I18N
    return <div className='vcv-migration-notice'>
      <img className='vcv-migration-image' src={migrateIcon} alt='Migrate' />
      <h1 className='vcv-migration-title'>WPBakery Page Builder Layout Detected</h1>
      <p className='vcv-migration-description'>In order to proceed with the Website Builder, you will need to download Migration add-on from the Visual Composer Hub. The migration add-on will transfer your WPBakery layout to Visual Composer. Basic elements will be converted into Visual Composer elements, rest of the elements will be converted into the Shortcode element.</p>
      <button className='vcv-migration-button vcv-migration-button--start' onClick={this.clickDownloadAddon.bind(this)}>Download Migration Addon</button>
      <button className='vcv-migration-button vcv-migration-button--back' onClick={this.clickSkip.bind(this)}>Skip</button>
    </div>
  }
}
