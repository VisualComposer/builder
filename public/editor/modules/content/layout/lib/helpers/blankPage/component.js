import React from 'react'
import ContentElementControl from './lib/elementControl'

export default class BlankPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isBlank: true
    }
  }

  render () {
    return (
      <div className='vcv-blank-page-container'>
        <div className='vcv-blank-page-heading-container'>
          <span className='vcv-blank-page-heading'>A Blank Page.</span>
          <span className='vcv-blank-page-heading'>Add Your First Content Element or Select A Template.</span>
        </div>
        <div className='vcv-blank-page-controls-container'>
          <ContentElementControl title={'Row'} name={'Row'} />
          <ContentElementControl title={'Text Block'} name={'Text-Block'} />
          <ContentElementControl title={'Image Gallery'} name={'Image-Gallery'} />
          <ContentElementControl title={'Video'} name={'Video'} />
          <ContentElementControl title={'Button'} name={'Button'} />
          <button className='vcv-ui-control'>
            <span>
              <i className='vcv-ui-icon vcv-ui-icon-add' />
            </span>
          </button>
        </div>
        <div className='vcv-blank-page-controls-container'>
          <button className='vcv-ui-control'>
            <span>
              <i className='vcv-ui-icon vcv-ui-icon-template' />
            </span>
          </button>
        </div>
        <div className='vcv-blank-page-description-container'>Description</div>
      </div>
    )
  }
}
