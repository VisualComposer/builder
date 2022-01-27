import React, { useEffect } from 'react'

interface EmptyCommentElementWrapperProps {
  children?: React.ReactNode
}

export default function EmptyCommentElementWrapper({ children }: EmptyCommentElementWrapperProps) {
  const ref = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref && ref.current) {
      ref.current.insertAdjacentHTML('beforebegin', '<!-- wp:vcwb/empty-comment-element-wrapper -->')
      ref.current.insertAdjacentHTML('afterend', '<!-- /wp:vcwb/empty-comment-element-wrapper -->')
    }
    const current = ref.current

    return () => {
      if (ref && current && current.parentNode) {
        // for each siblings clear comments
        const siblings: NodeListOf<ChildNode> = current.parentNode.childNodes
        for (let i = 0; i < siblings.length; i++) {
          // if comment contains emptyCommentElementWrapper text
          if (siblings[i].nodeType === document.COMMENT_NODE && siblings[i]?.textContent?.includes('empty-comment-element-wrapper')) {
            siblings[i].remove()
          }
        }
      }
    }
  }, [])

  return (
    <div ref={ref}>
      {children}
    </div>
  )
}
