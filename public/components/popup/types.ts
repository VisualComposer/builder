interface Popup {
  visible: boolean
  priority: number
  voteValue?: any
}

export interface Popups {
  [key:string]: Popup
}

export interface PopupProps {
  onClose: () => void
  onPrimaryButtonClick: () => void
}

export interface ReviewPopupProps extends PopupProps {
  popups: Popups
}

export interface VotePopupProps extends PopupProps {
  popupVisibilitySet: (status: boolean) => void
  popupShown: any
  popupsSet: any
  popups: Popups
}

export interface PopupInnerProps extends PopupProps {
  children: JSX.Element | JSX.Element[],
  headingText: string
  popupName: string
  customButtonProps?: {
    [key:string]: string | boolean
  },
  customButtonTag?: keyof JSX.IntrinsicElements
  badge?: JSX.Element
  buttonText?: string
}

export interface FullPagePopupContainerProps {
  activeFullPopupSet: (activeFullPopup:string | boolean) => void
  fullScreenPopupData: any
  activeFullPopup: string
}

export interface PopupContainerProps {
  activePopup: string
  allPopupsHidden: () => void
  isPopupVisible: boolean
  popupVisibilitySet: (status:boolean) => void
}

export interface CustomButtonProps<T> {
    [key:string]: T
}

declare global {
  interface Window {
    vcvSettingsDashboardUrl: string
  }
}
