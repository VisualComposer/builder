import React from 'react'
import ContentElementControl from './lib/elementControl'

export default class BlankPage extends React.Component {
  // static propTypes = {
  //   api: React.PropTypes.object.isRequired
  // }
  constructor (props) {
    super(props)
    this.state = {
      isBlank: true
    }
  }
  // static defaultProps = {
  //   control: [
  //     {},
  //     {},
  //     {}
  //   ]
  // }
  setControlsLayout () {
    let innerDoc = document.getElementById('vcv-editor-iframe').contentWindow.document
    let container = innerDoc.querySelector('.vcv-blank-page-controls-container')
    let buttons = container.children
    let buttonsWidth = buttons.length * buttons[0].offsetWidth
    let freeSpace
    console.log(buttonsWidth)
    console.log(container.offsetWidth)
    if (buttonsWidth > container.offsetWidth) {
      return
    } else {
      freeSpace = container.offsetWidth - buttonsWidth
      let distributeSpace = freeSpace / (buttons.length - 1)
      // console.log(distributeSpace)
      // console.log(buttons)
      for (let i in buttons) {
        if (buttons.hasOwnProperty(i)) {
          if (i !== '0') {
            buttons[i].style.marginLeft = distributeSpace + 'px'
          }
        }
      }
    }
  }
  componentWillMount () {
    console.log('go')
    setTimeout(() => {
      this.setControlsLayout()
    }, 50)
  }

  render () {
    return (
      <div className='vcv-blank-page-container'>
        <div className='vcv-blank-page-heading-container'>
          <span className='vcv-blank-page-heading'>A Blank Page.</span>
          <span className='vcv-blank-page-heading'>Add Your First Content Element or Select A Template.</span>
        </div>
        <div className='vcv-blank-page-controls-container'>
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
        <div className='vcv-blank-page-controls-container'>
          <button className='vcv-ui-element-control vcv-ui-element-control--template'>
            <span>
              <i className='vcv-ui-icon vcv-ui-icon-template' />
            </span>
          </button>
        </div>
        <div className='vcv-blank-page-description-container'>Row and Column are the basic structural element for building an initial content structure by adding rows and dividing them into columns. You can insert other content elements into columns.</div>
      </div>
    )
  }
}
