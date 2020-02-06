export const themeTemplatesToggle = () => {
  const pageTemplateSwitcher = document.querySelector('.vcv-custom-page-template-switcher input')
  if (pageTemplateSwitcher) {
    const pageTemplateDropdowns = document.querySelectorAll('.vcv-custom-page-template-dropdown')

    const handleDropdownVisibility = (event) => {
      pageTemplateDropdowns.forEach((dropdown) => {
        if ((event && event.target.checked) || (pageTemplateSwitcher.checked && !event)) {
          dropdown.classList.remove('vcv-hidden')
        } else {
          dropdown.classList.add('vcv-hidden')
        }
      })
    }

    handleDropdownVisibility()
    pageTemplateSwitcher.addEventListener('change', handleDropdownVisibility)
  }
}
