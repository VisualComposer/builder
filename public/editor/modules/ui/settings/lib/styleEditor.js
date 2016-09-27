import React from 'react'
import AceEditor from 'react-ace'

class StyleEditor extends React.Component {
  render () {
    return (
      <div className='vcv-ui-style-editor-container'>
        <div className='vcv-ui-style-editor'>
          <AceEditor
            width='100%'
            height='200px'
            editorProps={{$blockScrolling: true}}
            showPrintMargin={false}
          />
        </div>
        <p className='vcv-ui-form-helper'>Local CSS will be applied to this particular page only</p>
      </div>
    )
  }
}

export default StyleEditor
