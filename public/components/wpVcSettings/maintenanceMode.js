export const maintenanceMode = () => {
  const input = document.querySelector('input[value="maintenanceMode-enabled"]')
  if (input) {
    const check = () => {
      input.closest('.vcv-maintenance-mode-section.vcv-maintenance-mode_vcv-maintenanceMode').classList.toggle('vcv-visible', !!input.checked)
    }
    input.addEventListener('change', check)
    check()
  }
}
