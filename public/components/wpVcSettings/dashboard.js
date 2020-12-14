import { getService } from 'vc-cake'
const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')
const unsavedChangesText = localizations && localizations.unsavedChangesText ? localizations.unsavedChangesText : 'Changes may not be saved.'

export const dashboard = () => {
  const dashboardContainer = document.querySelector('.vcv-settings')
  // check if script will be executed in dashboard page
  if (!dashboardContainer) {
    return
  }
  let httpRequest = false
  let tabletMinHeight = ''
  let desktopMinHeight = ''
  let formTouched = false
  const urlHash = new URL(document.URL).hash
  const navigationToggle = document.querySelector('.vcv-dashboard-nav-toggle')
  const navigationMenu = document.querySelector('.vcv-dashboard-sidebar-navigation-container')
  const submenuLinks = Array.from(document.querySelectorAll('.vcv-dashboard-sidebar-navigation-menu--submenu .vcv-dashboard-sidebar-navigation-link'))
  const menuLinks = Array.from(document.querySelectorAll('.vcv-dashboard-sidebar-navigation-link'))
  const sections = Array.from(document.querySelectorAll('.vcv-dashboards-section-content'))
  const contentForms = Array.from(document.querySelectorAll('.vcv-settings-tab-content'))
  const dataCollectionTableWrapper = document.querySelector('.vcv-ui-settings-data-collection-table-wrapper')
  const dataCollectionTableButton = document.querySelector('#vcv-data-collection-table-button')
  const adminMenuBack = document.querySelector('#adminmenuback')
  const adminMenuWrap = document.querySelector('#adminmenuwrap')
  const dashboardStylesContainer = document.querySelector('#vcv-dashboard-styles')
  const initialDashboardStyles = dashboardStylesContainer.innerHTML

  const setDashboardMinHeight = () => {
    if (window.innerWidth < 783) {
      return
    }
    let minHeightStyle
    const adminMenuWrapHeight = window.getComputedStyle(adminMenuWrap).height
    const adminMenuBackHeight = window.getComputedStyle(adminMenuBack).height
    const wpSidebarHeight = window.innerHeight > parseInt(adminMenuWrapHeight) ? adminMenuBackHeight : adminMenuWrapHeight

    if (window.innerWidth > 782 && window.innerWidth < 961) {
      minHeightStyle = `@media screen and (min-width: 783px) { .vcv-dashboard-container { min-height: ${wpSidebarHeight}; }}`
      tabletMinHeight = minHeightStyle
      dashboardStylesContainer.innerHTML = initialDashboardStyles + minHeightStyle + desktopMinHeight
    }

    if (window.innerWidth > 960) {
      minHeightStyle = `@media screen and (min-width: 961px) { .vcv-dashboard-container { min-height: ${wpSidebarHeight}; }}`
      desktopMinHeight = minHeightStyle
      dashboardStylesContainer.innerHTML = initialDashboardStyles + tabletMinHeight + minHeightStyle
    }
  }

  const handleNavigationToggle = () => {
    navigationMenu.classList.toggle('vcv-is-navigation-visible')
    const ariaExpandedAttr = navigationToggle.getAttribute('aria-expanded')
    const newAriaExpandedAttr = ariaExpandedAttr === 'true' ? 'false' : 'true'
    navigationToggle.setAttribute('aria-expanded', newAriaExpandedAttr)
  }

  const handleSubmenuLinkClick = (e) => {
    if (e.target.getAttribute('href') !== 'javascript:void(0)') {
      return
    }
    e.preventDefault()
    const sectionValue = e.target.dataset.value

    submenuLinks.forEach(link => {
      if (link.classList.contains('vcv-dashboard-sidebar-navigation-link--active')) {
        link.classList.remove('vcv-dashboard-sidebar-navigation-link--active')
      }
    })
    let activeSection = null
    sections.forEach(section => {
      if (section.classList.contains('vcv-dashboards-section-content--active')) {
        section.classList.remove('vcv-dashboards-section-content--active')
      }
      if (section.dataset.section === sectionValue) {
        activeSection = section
        section.classList.add('vcv-dashboards-section-content--active')
      }
    })
    e.target.classList.add('vcv-dashboard-sidebar-navigation-link--active')
    const currentURL = window.location.href
    const newUrl = currentURL.replace(window.location.search, `?page=${sectionValue}`)
    window.history.pushState('', '', newUrl)
    // Find "‹" in title
    const charPositionTitle = document.title.indexOf(String.fromCharCode(8249))
    if (activeSection && charPositionTitle > -1) {
      const newTitle = activeSection.querySelector('h1').textContent
      document.title = document.title.replace(document.title.substring(0, charPositionTitle - 1), newTitle)
    }

    if (window.innerWidth <= 782) {
      navigationToggle.click()
    }
  }

  const handleFormResponse = (submitButtonContainer, submitButton) => {
    if (httpRequest.readyState === window.XMLHttpRequest.DONE) {
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
    formTouched = false
    window.vcvIsCodeEditorsTouched = false
    const action = e.target.getAttribute('action')
    const submitButtonContainer = e.target.querySelector('.vcv-submit-button-container')
    const submitButton = e.target.querySelector('#submit_btn')
    // this will get all form fields and encode it as a string
    const data = Array.from(
      new window.FormData(e.target),
      e => e.map(window.encodeURIComponent).join('=')
    ).join('&')

    httpRequest = new window.XMLHttpRequest()
    httpRequest.onreadystatechange = handleFormResponse.bind(this, submitButtonContainer, submitButton)
    httpRequest.open('POST', action)
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
    httpRequest.send(data)

    submitButtonContainer.classList.add('vcv-dashboard-button--loading')
    submitButton.setAttribute('disabled', true)
  }

  const handleMenuLinkClick = (e) => {
    if (formTouched) {
      const userResponse = window.confirm(unsavedChangesText)
      if (!userResponse) {
        e.preventDefault()
      } else {
        if (e.target.closest('.vcv-dashboard-sidebar-navigation-menu--submenu')) {
          handleSubmenuLinkClick(e)
        }
        formTouched = false
      }
    } else {
      if (e.target.closest('.vcv-dashboard-sidebar-navigation-menu--submenu')) {
        handleSubmenuLinkClick(e)
      }
    }
  }

  const handleContentFormChange = (e) => {
    formTouched = true
  }

  // Implement throttle on window resize
  const handleWindowResize = (func, duration) => {
    let shouldWait = false
    return function (...args) {
      if (!shouldWait) {
        func.apply(this, args)
        shouldWait = true
        setTimeout(function () {
          shouldWait = false
        }, duration)
      }
    }
  }

  const handleDataCollectionTableToggle = () => {
    if (!dataCollectionTableWrapper) {
      return
    }
    window.jQuery(dataCollectionTableWrapper).slideToggle()
  }

  setDashboardMinHeight()

  if (dataCollectionTableWrapper) {
    if (urlHash.indexOf(dataCollectionTableWrapper.id) !== -1) {
      dataCollectionTableWrapper.style.display = 'block'
    }
    dataCollectionTableButton.addEventListener('click', handleDataCollectionTableToggle)
  }
  menuLinks.forEach(link => link.addEventListener('click', handleMenuLinkClick))
  contentForms.forEach(form => {
    form.addEventListener('submit', handleContentFormSubmit)
    form.addEventListener('change', handleContentFormChange)
  })
  navigationToggle.addEventListener('click', handleNavigationToggle)
  window.addEventListener(
    'resize',
    handleWindowResize(() => {
      setDashboardMinHeight()
    }, 250)
  )
  window.onbeforeunload = () => {
    const isCodeEditorsTouched = dataManager.get('isCodeEditorsTouched')
    if (formTouched || isCodeEditorsTouched) {
      return unsavedChangesText
    }
  }
}
