import React from 'react'
import vcCake from 'vc-cake'

const vcvAPI = vcCake.getService('api')

export default class OutlineButtonElement extends vcvAPI.elementComponent {
  getColorSelector (colors) {
    const selector = colors.map(color => {
      return [...color.matchAll(/[\da-f]+/gi)].map(match => match[0]).join('-')
    })
    return selector.join('--')
  }

  render () {
    const { id, atts, editor } = this.props
    const {
      buttonUrl,
      buttonText,
      shape,
      alignment,
      customClass,
      buttonType,
      metaCustomId,
      size,
      toggleStretchButton,
      color,
      hoverColorAnimated,
      hoverColorOutline,
      borderColor,
      hoverBorder,
      hoverBackground
    } = atts

    const wrapperClasses = ['vce-button--style-outline-wrapper', 'vce']
    const containerClasses = ['vce-button--style-outline-container']

    const classes = ['vce-button']

    const buttonHtml = buttonText
    let customProps = {}
    let CustomTag = 'button'
    const buttonCustomClass = buttonType ? `vce-button--style-${buttonType}` : 'vce-button--style-outline'
    classes.push(buttonCustomClass)

    if (buttonUrl && buttonUrl.url) {
      CustomTag = 'a'
      const { url, title, targetBlank, relNofollow } = buttonUrl
      customProps = {
        href: url,
        title: title,
        target: targetBlank ? '_blank' : undefined,
        rel: relNofollow ? 'nofollow' : undefined
      }
    }

    if (typeof customClass === 'string' && customClass) {
      containerClasses.push(customClass)
    }

    if (shape) {
      classes.push(`vce-button--style-outline--border-${shape}`)
    }

    if (alignment) {
      containerClasses.push(`vce-button--style-outline-container--align-${alignment}`)
    }

    if (size) {
      classes.push(`vce-button--style-outline--size-${size}`)
    }

    if (toggleStretchButton) {
      wrapperClasses.push('vce-button--style-outline-wrapper--stretched')
    }

    classes.push(`${buttonCustomClass}--color-${this.getColorSelector([color, hoverColorAnimated, hoverColorOutline])}`)
    classes.push(`${buttonCustomClass}--border-color-${this.getColorSelector([borderColor, hoverBorder])}`)
    classes.push(`${buttonCustomClass}--background-color-${this.getColorSelector([hoverBackground])}`)

    // TODO: can't find the use case, possibly can remove
    // mixinData = this.getMixinData('designOptions')
    //
    // if (mixinData) {
    //   classes.push(`${buttonCustomClass}--background-color-${mixinData.selector}`)
    // }

    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    const doMargin = this.applyDO('margin')
    const doRest = this.applyDO('padding border background animation')

    return (
      <div className={containerClasses.join(' ')} {...editor}>
        <span className={wrapperClasses.join(' ')} id={'el-' + id} {...doMargin}>
          <CustomTag className={classes.join(' ')} {...customProps} {...doRest}>
            <span className='vce-button--style-outline-text'>
              {buttonHtml}
            </span>
          </CustomTag>
        </span>
      </div>
    )
  }
}
