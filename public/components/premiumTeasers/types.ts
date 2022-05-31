export interface Notification {
  type: string,
  text: string,
  time: number
}

export interface PremiumTeaserProps {
  headingText: string,
  buttonText: string,
  description: string,
  url: string,
  isPremiumActivated: boolean,
  addonName: string,
  onClose: () => void,
  onPrimaryButtonClick: () => void,
  notificationAdded: (notification: Notification) => void
}
