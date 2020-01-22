import React from 'react'
import vcCake from 'vc-cake'

const vcvAPI = vcCake.getService('api')

export default class BasicSeparator extends vcvAPI.elementComponent {
  render () {
    const { id, atts, editor } = this.props
    const { alignment, customClass, metaCustomId, style } = atts
    const classNames = require('classnames')
    const customProps = {}
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

    let mixinData = this.getMixinData('basicColor')

    if (mixinData) {
      classes.push(`vce-separator--color-${mixinData.selector}`)
    }

    mixinData = this.getMixinData('separatorWidth')

    if (mixinData) {
      classes.push(`vce-separator--width-${mixinData.selector}`)
    }

    mixinData = this.getMixinData('separatorThickness')

    if (mixinData) {
      classes.push(`vce-separator--thickness-${mixinData.selector}`)
    }

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
