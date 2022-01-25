import { getService } from 'vc-cake'
import importJS from '../../wordpressSettings'

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
  let formTouched = false
  const urlHash = new URL(document.URL).hash
  const dashboardSidebar = document.querySelector('.vcv-dashboard-sidebar')
  const navigationToggle = document.querySelector('.vcv-dashboard-nav-toggle')
  const navigationMenuContainer = document.querySelector('.vcv-dashboard-sidebar-navigation-container')
  const navigationMenu = document.querySelector('.vcv-dashboard-sidebar-navigation.vcv-dashboard-sidebar-navigation--main')
  const navigationMenuTop = document.querySelector('.vcv-dashboard-sidebar-navigation-menu')
  const navigationMenuBottom = document.querySelector('.vcv-dashboard-sidebar-navigation-bottom-menu')
  const submenuLinks = Array.from(document.querySelectorAll('.vcv-dashboard-sidebar-navigation-menu--submenu .vcv-dashboard-sidebar-navigation-link'))
  const menuLinks = Array.from(document.querySelectorAll('.vcv-dashboard-sidebar-navigation-link'))
  const sections = Array.from(document.querySelectorAll('.vcv-dashboards-section-content'))
  const contentForms = Array.from(document.querySelectorAll('.vcv-settings-tab-content'))
  const dataCollectionTableWrapper = document.querySelector('.vcv-ui-settings-data-collection-table-wrapper')
  const dataCollectionTableButton = document.querySelector('#vcv-data-collection-table-button')
  const setDashboardMenuStyles = () => {
    const innerHeight = window.innerHeight - 30 - 32 - 30 - 32 // 2x paddings(30px) and logo(title) (32px) and admin-bar(32px)
    if ((parseInt(window.getComputedStyle(navigationMenuTop).height) + parseInt(window.getComputedStyle(navigationMenuBottom).height)) > innerHeight) {
      dashboardSidebar.style.height = 'auto'
      navigationMenu.style.justifyContent = 'flex-start'
    } else {
      dashboardSidebar.style.height = '100%'
      navigationMenu.style.justifyContent = 'space-between'
    }
  }
  const handleNavigationToggle = () => {
    navigationMenuContainer.classList.toggle('vcv-is-navigation-visible')
    const ariaExpandedAttr = navigationToggle.getAttribute('aria-expanded')
    const newAriaExpandedAttr = ariaExpandedAttr === 'true' ? 'false' : 'true'
    navigationToggle.setAttribute('aria-expanded', newAriaExpandedAttr)
  }

  const handleSubmenuLinkClick = (e) => {
    if (!e.target.classList.contains('vcv-dashboard-sidebar-navigation-link--same-parent')) {
      return
    }
    e.preventDefault()
    const sectionValue = e.target.dataset.value

    importJS(sectionValue)

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
    if (!action) {
      return
    }
    const submitButtonContainer = e.target.querySelector('.vcv-submit-button-container')
    const submitButton = e.target.querySelector('.vcv-dashboard-button--save')
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
    if (e.target.classList.contains('vcv-dashboard-caret')) {
      e.target.closest('.vcv-dashboard-sidebar-navigation-menu-item-parent').classList.toggle('vcv-dashboard-sidebar-navigation-menu-item--active')
      e.preventDefault()
    }
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
    setDashboardMenuStyles()
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
      setDashboardMenuStyles()
    }, 250)
  )
  window.onbeforeunload = () => {
    const isCodeEditorsTouched = dataManager.get('isCodeEditorsTouched')
    if (formTouched || isCodeEditorsTouched) {
      return unsavedChangesText
    }
  }
}
