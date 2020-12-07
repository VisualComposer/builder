import React from 'react'

export default (props) => (
  <button type='button' className={props.classNames.selectedTag}>
    <span className={props.classNames.selectedTagName}>{props.tag.name}</span>
    <i
      className='vcv-ui-icon vcv-ui-icon-close-thin'
      onClick={props.onDelete}
      title={props.removeButtonText}
    />
  </button>
)
