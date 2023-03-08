declare module '*.jpg' {
  export default '' as string
}
declare module '*.png' {
  export default '' as string
}

declare module 'react-custom-scrollbars'

export interface ElementData {
  // element data may hold different properties with different values
  [key:string]: any // eslint-disable-line
}
