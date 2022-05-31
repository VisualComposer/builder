export interface LoadingOverlayComponentProps {
  parent:  string,
  hideLayoutBar:  boolean,
  disableNavBar:  boolean,
  extraClassNames: {
    [key: string]: boolean
  },
  isTransparent: boolean
}
