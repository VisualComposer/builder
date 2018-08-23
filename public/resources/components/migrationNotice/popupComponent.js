import React from 'react'

export default class PopupComponent extends React.Component {
  closePopup (e) {
    this.props.close()
  }

  backToWordpress (e) {
    window.location.href = window.vcvPostData.backendEditorUrl
  }

  render () {
    return <div style={{
      position: 'fixed',
      background: 'red',
      width: '100%',
      height: '100%',
      zIndex: '1150',
      top: '0',
      left: '0',
      opacity: '0.4'
    }}>
      <div>
        <p>WPBakery Page Builder Layout Detected</p>

        <p>In order to proceed with the Website Builder, you will need to migrate your layout. Basic elements of the page builder will be replaced with the elements of the website builder, the rest of the elements will be replaced with the Shortcode Element.

          Migration may result in style changes, we highly recommend to create a backup copy of your site before the migration. Upon save, you will be asked to confirm or revert migration results.</p>
        <label><input type='checkbox' /> I understand and accept the process of migration</label>
        <button onClick={this.closePopup.bind(this)}>Start migration</button>
        <button onClick={this.backToWordpress.bind(this)}>Back to wordpress</button>
      </div>
    </div>
  }
}
