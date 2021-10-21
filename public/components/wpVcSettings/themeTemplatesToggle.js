export const themeTemplatesToggle = () => {
  const pageTemplateSwitchers = document.querySelectorAll('.vcv-custom-page-template-switcher input')

  for (let i = 0, len = pageTemplateSwitchers.length; i < len; i++) {
    const switcher = pageTemplateSwitchers[i]
    const pageTemplateDropdowns = switcher.closest('.vcv-headers-footers-section').querySelectorAll('.vcv-child-section')

    const handleDropdownVisibility = (event) => {
      pageTemplateDropdowns.forEach((dropdown) => {
        if ((event && event.target.checked) || (switcher.checked && !event)) {
          dropdown.classList.remove('vcv-hidden')
        } else {
          dropdown.classList.add('vcv-hidden')
        }
      })
    }

    handleDropdownVisibility()
    switcher.addEventListener('change', handleDropdownVisibility)
  }
}
