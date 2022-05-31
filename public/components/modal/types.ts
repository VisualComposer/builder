export interface ModalProps {
  children: JSX.Element | JSX.Element[],
  onClose: () => void,
  closeOnOuterClick: boolean,
  show: boolean
}
