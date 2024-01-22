/* global NodeListOf, ChildNode */
import React, { useEffect } from 'react'
import classNames from 'classnames'

interface EmptyCommentElementWrapperProps {
  children?: React.ReactNode,
  isControls?: boolean
}

export default function EmptyCommentElementWrapper ({ children, isControls }: EmptyCommentElementWrapperProps) {
  const ref = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref && ref.current) {
      ref.current.insertAdjacentHTML('beforebegin', '<!-- wp:vcwb/empty-comment-element-wrapper -->')
      ref.current.insertAdjacentHTML('afterend', '<!-- /wp:vcwb/empty-comment-element-wrapper -->')
    }
    const current = ref.current

    return () => {
      if (ref && current && current.parentNode) {
        // for each sibling clear comments
        const siblings: NodeListOf<ChildNode> = current.parentNode.childNodes // global firestore
        for (let i = 0; i < siblings.length; i++) {
          // if comment contains emptyCommentElementWrapper text
          if (siblings[i].nodeType === document.COMMENT_NODE && siblings[i]?.textContent?.includes('empty-comment-element-wrapper')) {
            siblings[i].remove()
          }
        }
      }
    }
  }, [])

  const classes = classNames({
    'vcv-row-control-wrapper': isControls
  })
  return (
    <div ref={ref} className={classes}>
      {children}
    </div>
  )
}
