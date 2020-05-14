export const dashboard = () => {
  let httpRequest
  const navigationToggle = document.querySelector('.vcv-dashboard-nav-toggle')
  const navigationMenu = document.querySelector('.vcv-dashboard-sidebar-navigation-container')
  const submenuLinks = Array.from(document.querySelectorAll('.vcv-dashboard-sidebar-navigation-menu--submenu .vcv-dashboard-sidebar-navigation-link'))
  const sections = Array.from(document.querySelectorAll('.vcv-dashboards-section-content'))
  const contentForms = Array.from(document.querySelectorAll('.vcv-settings-tab-content'))

  const handleNavigationToggle = () => {
    navigationMenu.classList.toggle('vcv-is-navigation-visible')
    const ariaExpandedAttr = navigationToggle.getAttribute('aria-expanded')
    const newAriaExpandedAttr = ariaExpandedAttr === 'true' ? 'false' : 'true'
    navigationToggle.setAttribute('aria-expanded', newAriaExpandedAttr)
  }

  const handleSubmenuLinkClick = (e) => {
    e.preventDefault()
    const sectionValue = e.target.dataset.value

    submenuLinks.forEach(link => {
      if (link.classList.contains('vcv-dashboard-sidebar-navigation-link--active')) {
        link.classList.remove('vcv-dashboard-sidebar-navigation-link--active')
      }
    })
    sections.forEach(section => {
      if (section.classList.contains('vcv-dashboards-section-content--active')) {
        section.classList.remove('vcv-dashboards-section-content--active')
      }
      if (section.dataset.section === sectionValue) {
        section.classList.add('vcv-dashboards-section-content--active')
      }
    })
    e.target.classList.add('vcv-dashboard-sidebar-navigation-link--active')

    if (window.innerWidth <= 872) {
      navigationToggle.click()
    }
  }

  const handleFormResponse = (submitButtonContainer, submitButton) => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        submitButton.removeAttribute('disabled')
        submitButtonContainer.classList.remove('vcv-dashboard-button--loading')
      } else {
        console.warn('Request failed', httpRequest.status)
      }
    }
  }

  const handleContentFormSubmit = (e) => {
    e.preventDefault()
    const action = e.target.getAttribute('action')
    const submitButtonContainer = e.target.querySelector('.vcv-submit-button-container')
    const submitButton = e.target.querySelector('#submit_btn')
    // this will get all form fields and encode it as a string
    const data = Array.from(
      new FormData(e.target),
      e => e.map(window.encodeURIComponent).join('=')
    ).join('&')

    httpRequest = new XMLHttpRequest()
    httpRequest.onreadystatechange = handleFormResponse.bind(this, submitButtonContainer, submitButton)
    httpRequest.open('POST', action)
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
    httpRequest.send(data)

    submitButtonContainer.classList.add('vcv-dashboard-button--loading')
    submitButton.setAttribute('disabled', true)
  }

  submenuLinks.forEach(link => link.addEventListener('click', handleSubmenuLinkClick))
  contentForms.forEach(form => form.addEventListener('submit', handleContentFormSubmit))
  navigationToggle.addEventListener('click', handleNavigationToggle)
}
