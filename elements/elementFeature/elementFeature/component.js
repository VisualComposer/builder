import React from 'react'
import vcCake from 'vc-cake'
import classNames from 'classnames'

const vcvAPI = vcCake.getService('api')

export default class Feature extends vcvAPI.elementComponent {
  render () {
    const { id, atts, editor, children } = this.props
    const { description, align, customClass, metaCustomId, extraDataAttributes } = atts
    const customProps = {}
    const customContainerProps = this.getExtraDataAttributes(extraDataAttributes)

    let containerClasses = classNames({
      'vce-feature': true,
      'vce-feature--alignment--left': align === 'left',
      'vce-feature--alignment--right': align === 'right',
      'vce-feature--alignment--center': align === 'center'
    })

    let wrapperClasses = ['vce', 'vce-feature--wrap-row']
    wrapperClasses = classNames(wrapperClasses)

    if (typeof customClass === 'string' && customClass) {
      containerClasses = containerClasses.concat(' ' + customClass)
    }

    if (metaCustomId) {
      customContainerProps.id = metaCustomId
    }

    const doAll = this.applyDO('all')

    return (
      <section className={containerClasses} {...editor} {...customContainerProps}>
        <div className={wrapperClasses} id={'el-' + id} {...customProps} {...doAll}>
          {children}
          {description}
        </div>
      </section>
    )
  }
}
