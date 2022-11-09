import React from 'react'
import vcCake from 'vc-cake'
import classNames from 'classnames'

const vcvAPI = vcCake.getService('api')

export default class SeparatorTitle extends vcvAPI.elementComponent {
  getColorSelector (color) {
    return [...color.matchAll(/[\da-f]+/gi)].map(match => match[0]).join('-')
  }

  render () {
    const { id, atts, editor } = this.props
    const {
      separatorColor,
      separatorAlignment,
      separatorStyle,
      separatorThickness,
      separatorWidth,
      title,
      titleColor,
      customClass,
      metaCustomId,
      extraDataAttributes
    } = atts
    const customProps = this.getExtraDataAttributes(extraDataAttributes)
    let separatorContainerClasses = ['vce', 'vce-separator-with-title-container']
    let separatorClasses = ['vce-separator-with-title']
    const lineClasses = ['vce-separator-with-title--line']
    let leftLineClasses = []
    let rightLineClasses = []
    let titleClasses = ['vce-separator-with-title--title']

    if (typeof customClass === 'string' && customClass) {
      separatorContainerClasses.push(customClass)
    }

    if (separatorAlignment) {
      separatorContainerClasses.push(`vce-separator-with-title--align-${separatorAlignment}`)
    }

    if (separatorStyle) {
      lineClasses.push(`vce-separator-with-title--line--style-${separatorStyle}`)
    }

    separatorClasses.push(`vce-separator-with-title--color-${this.getColorSelector(separatorColor)}`)
    separatorClasses.push(`vce-separator-with-title--width-${separatorWidth}`)

    lineClasses.push(`vce-separator-with-title-line--thickness-${separatorThickness}`)

    titleClasses.push(`vce-separator-with-title--title--color-${this.getColorSelector(titleColor)}`)

    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    separatorClasses = classNames(separatorClasses)
    separatorContainerClasses = classNames(separatorContainerClasses)
    titleClasses = classNames(titleClasses)

    if (separatorStyle === 'shadow') {
      lineClasses.push('vce-separator-shadow')
      leftLineClasses.push('vce-separator-shadow-left')
      rightLineClasses.push('vce-separator-shadow-right')
    }

    leftLineClasses.push(...lineClasses)
    leftLineClasses.push('vce-separator-with-title--line-left')
    rightLineClasses.push(...lineClasses)
    rightLineClasses.push('vce-separator-with-title--line-right')

    leftLineClasses = classNames(leftLineClasses)
    rightLineClasses = classNames(rightLineClasses)

    const doMargin = this.applyDO('margin')
    const doRest = this.applyDO('border padding background animation')

    return (
      <div className={separatorContainerClasses} id={'el-' + id} {...editor} {...doMargin}>
        <div className={separatorClasses} {...customProps} {...doRest}>
          <div className={leftLineClasses} />
          <h3 className={titleClasses}>{title}</h3>
          <div className={rightLineClasses} />
        </div>
      </div>
    )
  }
}
