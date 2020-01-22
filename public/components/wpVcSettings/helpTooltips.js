const $ = window.jQuery
export const hoverTooltip = () => {
  const $tooltipIcon = $('.vcv-help-tooltip-icon')

  $tooltipIcon.mouseover((e) => {
    const $currentTarget = $(e.currentTarget)
    const container = $currentTarget.closest('.vcv-help')
    const tooltip = $currentTarget.next('.vcv-help-tooltip')

    container.addClass('vcv-help-tooltip--active')

    if (!elementInViewport(tooltip[0])) {
      tooltip.addClass('vcv-help-tooltip-position--top')
    }
  })

  $tooltipIcon.mouseleave((e) => {
    const $currentTarget = $(e.currentTarget)
    const container = $currentTarget.closest('.vcv-help')
    const tooltip = $currentTarget.next('.vcv-help-tooltip')

    container.removeClass('vcv-help-tooltip--active')

    tooltip.removeClass('vcv-help-tooltip-position--top')
  })

  const elementInViewport = (el) => {
    const rect = el.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }
}
