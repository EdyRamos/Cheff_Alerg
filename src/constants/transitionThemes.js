export const DEFAULT_TRANSITION = {
  text: '',
  image: '',
  animation: 'fade',
  audio: '/assets/audio/safe.ogg',
  duration: 3000,
  skipAfter: 2000,
  tip: ''
};

export const TRANSITION_THEMES = {
  default: DEFAULT_TRANSITION,
  slide: { ...DEFAULT_TRANSITION, animation: 'slide' },
  zoom: { ...DEFAULT_TRANSITION, animation: 'zoom' }
};
