export const dashboard = () => {
  const dashboardNavigationToggle = document.querySelector('.vcv-dashboard-nav-toggle')
  const dashboardNavigationMenu = document.querySelector('.vcv-dashboard-sidebar-navigation-container')

  const handleNavigationToggle = () => {
    dashboardNavigationMenu.classList.toggle('vcv-is-navigation-visible')
    const ariaExpandedAttr = dashboardNavigationToggle.getAttribute('aria-expanded')
    const newAriaExpandedAttr = ariaExpandedAttr === 'true' ? 'false' : 'true'
    dashboardNavigationToggle.setAttribute('aria-expanded', newAriaExpandedAttr)
  }

  dashboardNavigationToggle.addEventListener('click', handleNavigationToggle)
}
