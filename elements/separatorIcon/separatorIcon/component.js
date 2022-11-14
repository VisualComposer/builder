import React from 'react'
import vcCake from 'vc-cake'
import classNames from 'classnames'

const vcvAPI = vcCake.getService('api')

export default class SeparatorIcon extends vcvAPI.elementComponent {
  getColorSelector (color) {
    return [...color.matchAll(/[\da-f]+/gi)].map(match => match[0]).join('-')
  }

  render () {
    const { id, atts, editor } = this.props
    const {
      separatorColor,
      separatorAlignment,
      separatorStyle,
      iconPicker,
      iconShape,
      iconSize,
      iconColor,
      iconShapeColor,
      customClass,
      metaCustomId,
      separatorWidth,
      separatorThickness,
      extraDataAttributes
    } = atts
    const customProps = this.getExtraDataAttributes(extraDataAttributes)
    let iconClasses = [`vce-icon-container ${iconPicker.icon}`]
    let iconWrapperClasses = ['vce-separator-with-icon--icon', 'vce-icon']
    let separatorContainerClasses = ['vce', 'vce-separator-with-icon-container']
    let separatorClasses = ['vce-separator-with-icon']
    const lineClasses = ['vce-separator-with-icon--line']
    let leftLineClasses = []
    let rightLineClasses = []

    if (typeof customClass === 'string' && customClass) {
      separatorContainerClasses.push(customClass)
    }

    if (separatorAlignment) {
      separatorContainerClasses.push(`vce-separator-with-icon--align-${separatorAlignment}`)
    }

    if (separatorStyle) {
      lineClasses.push(`vce-separator-with-icon--line--style-${separatorStyle}`)
    }

    if (iconShape) {
      iconWrapperClasses.push(`vce-separator-with-icon--icon--style-shape-${iconShape}`)
    }

    if (iconSize) {
      iconWrapperClasses.push(`vce-separator-with-icon--icon--style-size-${iconSize}`)
    }

    separatorClasses.push(`vce-separator-with-icon--color-${this.getColorSelector(separatorColor)}`)
    separatorClasses.push(`vce-separator-with-icon--width-${separatorWidth}`)

    lineClasses.push(`vce-separator-with-icon-line--thickness-${separatorThickness}`)

    iconWrapperClasses.push(`vce-separator-with-icon--icon--style-color-${this.getColorSelector(iconColor)}`)
    iconWrapperClasses.push(`vce-separator-with-icon--icon--style-shape-color-${this.getColorSelector(iconShapeColor)}`)

    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    separatorClasses = classNames(separatorClasses)
    separatorContainerClasses = classNames(separatorContainerClasses)
    iconClasses = classNames(iconClasses)
    iconWrapperClasses = classNames(iconWrapperClasses)

    if (separatorStyle === 'shadow') {
      lineClasses.push('vce-separator-shadow')
      leftLineClasses.push('vce-separator-shadow-left')
      rightLineClasses.push('vce-separator-shadow-right')
    }

    leftLineClasses.push(...lineClasses)
    leftLineClasses.push('vce-separator-with-icon--line-left')
    rightLineClasses.push(...lineClasses)
    rightLineClasses.push('vce-separator-with-icon--line-right')

    leftLineClasses = classNames(leftLineClasses)
    rightLineClasses = classNames(rightLineClasses)

    const doMargin = this.applyDO('margin')
    const doRest = this.applyDO('border padding background animation')

    return (
      <div className={separatorContainerClasses} id={'el-' + id} {...editor} {...doMargin}>
        <div className={separatorClasses} {...customProps} {...doRest}>
          <div className={leftLineClasses} />
          <div className={iconWrapperClasses}>
            <svg xmlns='https://www.w3.org/2000/svg' viewBox='0 0 769 769'>
              <path strokeWidth='40' d='M565.755 696.27h-360l-180-311.77 180-311.77h360l180 311.77z' />
            </svg>
            <span className={iconClasses} />
          </div>
          <div className={rightLineClasses} />
        </div>
      </div>
    )
  }
}
