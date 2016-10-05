import React from 'react'
import ContentElementControl from './lib/elementControl'

export default class BlankPage extends React.Component {
  // static propTypes = {
  //   innerDoc: React.PropTypes.any,
  //   blankPageContainer: React.PropTypes.func,
  //   container: React.PropTypes.func,
  //   row: React.PropTypes.func,
  //   buttons: React.PropTypes.func,
  //   buttonStyle: React.PropTypes.func,
  //   buttonMargins: React.PropTypes.func,
  //   buttonWidth: React.PropTypes.func
  // }
  // static defaultProps = {
  //   innerDoc: document.getElementById('vcv-editor-iframe').contentWindow.document,
  //   blankPageContainer: () => {
  //     console.log(this)
  //     return this.innerDoc.querySelector('.vcv-blank-page-container')
  //   },
  //   container: () => {
  //     return this.blankPageContainer().querySelector('.vcv-blank-page-controls-container')
  //   },
  //   row: () => {
  //     return this.container().querySelector('.vcv-blank-page-controls-row')
  //   },
  //   buttons: () => {
  //     return this.row().children
  //   },
  //   buttonStyle: () => {
  //     return document.getElementById('vcv-editor-iframe').contentWindow.getComputedStyle(this.buttons()[0])
  //   },
  //   buttonMargins: () => {
  //     return parseFloat(this.buttonStyle()['marginLeft']) + parseFloat(this.buttonStyle()['marginRight'])
  //   },
  //   buttonWidth: () => {
  //     return this.buttons()[0].offsetWidth + this.buttonMargins()
  //   }
  // }
  constructor (props) {
    super(props)
    this.setControlsLayout = this.setControlsLayout.bind(this)
  }

  setControlsLayout () {
    let innerDoc = document.getElementById('vcv-editor-iframe').contentWindow.document
    let blankPageContainer = innerDoc.querySelector('.vcv-blank-page-container')
    let container = blankPageContainer.querySelector('.vcv-blank-page-controls-container')
    let row = container.querySelector('.vcv-blank-page-controls-row')
    let buttons = row.children
    let buttonStyle = document.getElementById('vcv-editor-iframe').contentWindow.getComputedStyle(buttons[0])
    let buttonMargins = parseFloat(buttonStyle['marginLeft']) + parseFloat(buttonStyle['marginRight'])
    let buttonWidth = buttons[0].offsetWidth + buttonMargins

    for (let el = 1; el <= buttons.length; el++) {
      if (buttonWidth * el > blankPageContainer.offsetWidth - buttonMargins) {
        container.style.maxWidth = ((buttonWidth * (el - 1)) - buttonMargins) + 'px'
        break
      } else {
        container.removeAttribute('style')
      }
    }
  }
  componentWillMount () {
    document.getElementById('vcv-editor-iframe').contentWindow.addEventListener('resize', this.setControlsLayout)
  }

  render () {
    return (
      <div className='vcv-blank-page-container'>
        <div className='vcv-blank-page-heading-container'>
          <span className='vcv-blank-page-heading'>A Blank Page.</span>
          <span className='vcv-blank-page-heading'>Add Your First Content Element or Select A Template.</span>
        </div>
        <div className='vcv-blank-page-controls-container'>
          <div className='vcv-blank-page-controls-row'>
            <ContentElementControl
              title={'Row'}
              name={'Row'}
              element={'row'}
            />
            <ContentElementControl
              title={'Text Block'}
              name={'Text-Block'}
              element={'text-block'}
            />
            <ContentElementControl
              title={'Image Gallery'}
              name={'Image-Gallery'}
              element={'image-gallery'}
            />
            <ContentElementControl
              title={'Video'}
              name={'Video'}
              element={'video'}
            />
            <ContentElementControl
              title={'Button'}
              name={'Button'}
              element={'button'}
            />
            <button className='vcv-ui-element-control vcv-ui-element-control--add'>
              <span>
                <i className='vcv-ui-icon vcv-ui-icon-add' />
              </span>
            </button>
          </div>
          <div className='vcv-blank-page-controls-row'>
            <button className='vcv-ui-element-control vcv-ui-element-control--template'>
              <span>
                <i className='vcv-ui-icon vcv-ui-icon-template' />
              </span>
            </button>
          </div>
          <div className='vcv-blank-page-description-container'>
            Row and Column are the basic structural element for building an initial content structure by adding rows and dividing them into columns. You can insert other content elements into columns.
          </div>
        </div>
      </div>
    )
  }
}
