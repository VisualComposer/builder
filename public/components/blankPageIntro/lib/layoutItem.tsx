import React, { useState, useEffect, memo, useCallback } from 'react'
import classNames from 'classnames'
import { getStorage, getService } from 'vc-cake'
import Tooltip from 'public/components/tooltip/tooltip'
import CustomLayoutDropdown from 'public/sources/attributes/pageSettingsLayouts/lib/customLayoutDropdown'
import Dropdown from 'public/sources/attributes/dropdown/Component'

const dataManager = getService('dataManager')
const hubTemplatesStorage = getStorage('hubTemplates')
const localizations = dataManager.get('localizations')

declare global {
  interface Window {
    vcvLastLoadedPageTemplate:string,
    vcvLastLoadedHeaderTemplate:string,
    vcvLastLoadedSidebarTemplate:string,
    vcvLastLoadedFooterTemplate:string
  }
}

interface Props {
  // setting type any because item can be a hub template item from storage
  itemData: any, // eslint-disable-line
  handleClick: (index: number, itemData:any) => void, // eslint-disable-line
  isActive: boolean,
  index: number
}

const LayoutItem: React.FC<Props> = ({ itemData, handleClick, isActive, index }) => {
  const [dropdownValue, setDropdownValue] = useState({ value: '' })
  const [templateDropdownValue, setTemplateDropdownValue] = useState('')
  const [hubTemplates, setHubTemplates] = useState(hubTemplatesStorage.state('templates').get())
  const [isLoading, setIsLoading] = useState(false)

  const handleTemplateChange = useCallback((templateType:string, id:string) => {
    if (templateType !== 'hub') {
      itemData.id = id
      handleClick(index, itemData)
    }
    setTemplateDropdownValue(id)
  }, [handleClick, index, itemData])

  const updateLayout = useCallback((data: { value: string }) => {
    setDropdownValue(data)
  }, [])

  // setting type any because item can be a hub template item from storage
  const templateStorageChange = useCallback((data:any) => { // eslint-disable-line
    if (!hubTemplates.length) {
      setHubTemplates(data)
    }
  }, [hubTemplates.length])

  const downloadTemplate = useCallback((data: { length: number }) => {
    if (data.length && !isLoading) {
      setIsLoading(true)
    }
  }, [isLoading])

  const handleItemClick = useCallback((e:React.MouseEvent) => {
    // we need it to prevent double click on a Windows environment
    const target = e.target as HTMLElement
    if (target.classList.contains('vcv-ui-form-dropdown')) {
      e.preventDefault()
      return
    }
    if (itemData.control === 'dropdown') {
      if (itemData.type === 'vc-theme') {
        const newValue = dropdownValue.value ? dropdownValue : {
          type: 'vc-custom-layout',
          value: 'default',
          stretchedContent: false
        }
        setDropdownValue(newValue)
      }
      if (itemData.type === 'myTemplate') {
        if (templateDropdownValue) {
          const newValue = templateDropdownValue
          setTemplateDropdownValue(newValue)
        }
      }
    }

    if (itemData.type === 'vc-theme' && (!dropdownValue.value || dropdownValue.value === 'default')) {
      itemData = {
        type: 'vc-custom-layout',
        value: 'default',
        stretchedContent: false
      }
    }
    handleClick(index, itemData)
  }, [handleClick, index, itemData, dropdownValue, templateDropdownValue])

  useEffect(() => {
    hubTemplatesStorage.state('templates').onChange(templateStorageChange)
    return () => {
      hubTemplatesStorage.state('templates').ignoreChange(templateStorageChange)
    }
  }, [isActive, downloadTemplate, templateStorageChange])

  const handleLayoutChange = useCallback((selectedTemplate:string) => {
    const layoutData = selectedTemplate.split('__')
    const value = layoutData[1]
    const data = {
      type: layoutData[0],
      value: value,
      stretchedContent: false
    }
    updateLayout(data)
    handleClick(index, data)
  }, [updateLayout, handleClick, index])

  const isSelect = itemData.control === 'dropdown'
  const icon:React.ReactElement | null = itemData?.icon?.default() || null
  const isPremiumActivated = dataManager.get('isPremiumActivated')
  let isDisabled = !isPremiumActivated && (itemData?.contentType === 'premium' || (itemData?.bundleType?.includes('premium') && !itemData?.bundleType?.includes('free')))
  const premiumBagde = isDisabled ? <span className='item-badge'>{localizations.premium || 'Premium'}</span> : null

  let tooltip:React.ReactElement | null = itemData.description && <Tooltip>{itemData.description}</Tooltip>
  let dropdown:React.ReactElement | null = null
  let checkedIcon:React.ReactElement | null = <i className='vcv-ui-icon vcv-ui-icon-checked-circle' />

  if (isSelect) {
    tooltip = null
    checkedIcon = null
    if (itemData.type === 'vc-theme') {
      const allAvailableVcLayouts = dataManager.get('pageTemplatesLayoutsAll')
      let hfsLayouts:React.ReactElement[] = allAvailableVcLayouts.find((layout: { type: string }) => layout.type === 'vc-theme').values
      hfsLayouts = hfsLayouts.map((layout:any) => { // eslint-disable-line
        layout.prefix = 'vc-theme__'
        return layout
      })
      dropdown = (
        <CustomLayoutDropdown
          onTemplateChange={handleLayoutChange}
          current={dropdownValue}
          options={hfsLayouts}
        />
      )
    } else {
      let options = {}
      let fieldKey = ''
      if (itemData.type === 'myTemplate') {
        let userTemplates = dataManager.get('globalTemplatesList')
        const templateGroups = userTemplates && userTemplates.filter((template: {group: {values: []}}) => {
          return template?.group?.values.length
        })
        if (templateGroups && !templateGroups.length) {
          userTemplates = [{
            label: localizations.noTemplates,
            value: ''
          }]
          isDisabled = true
        }
        options = { values: userTemplates }
        fieldKey = 'myTemplate'
      }
      if (itemData.type === 'layoutTemplate') {
        let userTemplates = dataManager.get('globalTemplatesList')
        const templateGroups = userTemplates && userTemplates.filter((template: {label: string, group: { label: string }}) => {
          const label = template?.label || template?.group?.label
          return label.toLowerCase() === 'my singular layout templates' || label.toLowerCase() === 'my archive templates'
        })
        if (templateGroups && !templateGroups.length) {
          userTemplates = [{
            label: localizations.noTemplates,
            value: ''
          }]
          isDisabled = true
        } else {
          const values = [
            {
              label: 'Select a layout',
              value: ''
            }
          ]
          userTemplates = values.concat(templateGroups)
        }
        options = { values: userTemplates }
        fieldKey = 'myTemplate'
      }
      if (itemData.type === 'popupTemplate') {
        const popupTemplates = hubTemplates?.popup?.templates
        let templates = []
        if (!popupTemplates || !popupTemplates.length) {
          templates = [{
            label: localizations.noTemplates,
            value: ''
          }]
          isDisabled = true
        } else {
          const values = [
            {
              label: localizations.selectAPopup || 'Select a popup',
              value: ''
            }
          ]
          templates = values.concat(popupTemplates)
        }
        options = { values: templates }
        fieldKey = 'popupTemplate'
      }
      dropdown = (<Dropdown
        fieldKey={fieldKey}
        options={options}
        value={templateDropdownValue}
        updater={handleTemplateChange}
      />)
    }
  }

  const itemClasses = classNames({
    'template-item': true,
    'template-item--selected': isActive,
    'template-item--disabled': isDisabled
  })
  const infoClasses = classNames({
    'template-info': true,
    'template-info--select': isSelect
  })
  const wrapperClasses = classNames({
    'template-item-wrapper': true,
    'template-item-wrapper--disabled': isDisabled
  })
  const styles = {
    backgroundImage: ''
  }
  if (itemData.isPageIntro) {
    styles.backgroundImage = `url(${itemData.introPageImageUrl})`
  }

  return (
    <div className={wrapperClasses}>
      <div className={itemClasses} onClick={handleItemClick}>
        {premiumBagde}
        <div className='template-thumbnail' style={styles}>
          {icon}
        </div>
        <div className={infoClasses}>
          <span className='template-label'>{itemData.label || itemData.name}</span>
          {dropdown}
          {tooltip}
          {checkedIcon}
        </div>
      </div>
    </div>
  )
}

export default memo(LayoutItem)
