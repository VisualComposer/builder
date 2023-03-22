interface Popup {
  visible: boolean
  priority: number
  voteValue?: string
}

export interface Popups {
  [key:string]: Popup
}

export interface PopupProps {
  onClose: () => void
  onPrimaryButtonClick: () => void
}

export interface VotePopupProps extends PopupProps {
  popupVisibilitySet: (status: boolean) => void
  popupShown: (popupName: string) => void
  popupsSet: (popups: Popups) => void
  popups: Popups
}

export interface PopupInnerProps extends PopupProps {
  children: JSX.Element | JSX.Element[] | null,
  headingText: string
  popupName: string
  customButtonProps?: {
    [key:string]: string | boolean
  },
  badge?: JSX.Element
  hasButton?: boolean
  customButtonTag?: keyof JSX.IntrinsicElements
  buttonText?: string
}

export interface FullPagePopupContainerProps {
  activeFullPopupSet: (activeFullPopup:string) => void
  fullScreenPopupData: any // eslint-disable-line
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
