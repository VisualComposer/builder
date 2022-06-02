export interface ScrollbarProps {
  content: number
  onScroll: () => void
  initialScrollTop: number
}

export interface ScrollbarState {
  showTracks: boolean
}
