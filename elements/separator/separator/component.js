import React from 'react'
import vcCake from 'vc-cake'
import classNames from 'classnames'

const vcvAPI = vcCake.getService('api')

export default class BasicSeparator extends vcvAPI.elementComponent {
  getColorSelector (color) {
    return [...color.matchAll(/[\da-f]+/gi)].map(match => match[0]).join('-')
  }

  render () {
    const { id, atts, editor } = this.props
    const { alignment, customClass, metaCustomId, style, color, width, thickness, extraDataAttributes } = atts
    const customProps = this.getExtraDataAttributes(extraDataAttributes)
    let separator

    let containerClasses = ['vce', 'vce-separator-container']
    let classes = ['vce-separator']

    if (typeof customClass === 'string' && customClass) {
      containerClasses.push(customClass)
    }

    if (alignment) {
      containerClasses.push(`vce-separator--align-${alignment}`)
    }

    if (style) {
      containerClasses.push(`vce-separator--style-${style}`)
    }

    classes.push(`vce-separator--color-${this.getColorSelector(color)}`)
    classes.push(`vce-separator--width-${width}`)
    classes.push(`vce-separator--thickness-${thickness}`)

    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    classes = classNames(classes)
    containerClasses = classNames(containerClasses)

    const doMargin = this.applyDO('margin')
    const doRest = this.applyDO('border padding background animation')

    if (style === 'shadow') {
      separator = (
        <div className={classes} {...customProps} {...doRest}>
          <div className='vce-separator-shadow vce-separator-shadow-left' />
          <div className='vce-separator-shadow vce-separator-shadow-right' />
        </div>
      )
    } else {
      separator = <div className={classes} {...customProps} {...doRest} />
    }

    return <div className={containerClasses} {...editor} id={'el-' + id} {...doMargin}>{separator}</div>
  }
}
