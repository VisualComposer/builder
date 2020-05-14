export const dashboard = () => {
  const navigationToggle = document.querySelector('.vcv-dashboard-nav-toggle')
  const navigationMenu = document.querySelector('.vcv-dashboard-sidebar-navigation-container')
  const submenuLinks = Array.from(document.querySelectorAll('.vcv-dashboard-sidebar-navigation-menu--submenu .vcv-dashboard-sidebar-navigation-link'))
  const sections = Array.from(document.querySelectorAll('.vcv-dashboards-section-content'))

  const handleNavigationToggle = () => {
    navigationMenu.classList.toggle('vcv-is-navigation-visible')
    const ariaExpandedAttr = navigationToggle.getAttribute('aria-expanded')
    const newAriaExpandedAttr = ariaExpandedAttr === 'true' ? 'false' : 'true'
    navigationToggle.setAttribute('aria-expanded', newAriaExpandedAttr)
  }

  const handleSubmenuLinkClick = (e) => {
    e.preventDefault()
    const href = e.target.getAttribute('href').slice(1)

    submenuLinks.forEach(link => {
      if (link.classList.contains('vcv-dashboard-sidebar-navigation-link--active')) {
        link.classList.remove('vcv-dashboard-sidebar-navigation-link--active')
      }
    })
    sections.forEach(section => {
      if (section.classList.contains('vcv-dashboards-section-content--active')) {
        section.classList.remove('vcv-dashboards-section-content--active')
      }
      if (section.dataset.section === href) {
        section.classList.add('vcv-dashboards-section-content--active')
      }
    })
    e.target.classList.add('vcv-dashboard-sidebar-navigation-link--active')

    if (window.innerWidth <= 872) {
      navigationToggle.click()
    }
  }

  submenuLinks.forEach(link => link.addEventListener('click', handleSubmenuLinkClick))
  navigationToggle.addEventListener('click', handleNavigationToggle)
}
