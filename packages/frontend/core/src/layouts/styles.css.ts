import { style } from '@vanilla-extract/css';

export const dragOverlay = style({
  display: 'flex',
  alignItems: 'center',
  zIndex: 1001,
  cursor: 'grabbing',
  maxWidth: '360px',
  transition: 'transform 0.2s, opacity 0.2s',
  willChange: 'transform opacity',
  selectors: {
    '&[data-over-drop=true]': {
      transform: 'scale(0.8)',
    },
    '&[data-sorting=true]': {
      opacity: 0,
    },
  },
});

export const browserAppViewContainer = style({
  display: 'flex',
  flexFlow: 'row',
  height: '100%',
  width: '100%',
  position: 'relative',
});

export const desktopAppViewContainer = style({
  display: 'flex',
  flexFlow: 'column',
  height: '100%',
  width: '100%',
});

export const desktopAppViewMain = style({
  display: 'flex',
  flexFlow: 'row',
  width: '100%',
  height: 'calc(100% - 52px)',
  position: 'relative',
});

export const desktopTabsHeader = style({
  display: 'flex',
  flexFlow: 'row',
  height: '52px',
  zIndex: 1,
  width: '100%',
  overflow: 'hidden',
});

export const desktopTabsHeaderTopLeft = style({
  display: 'flex',
  flexFlow: 'row',
  alignItems: 'center',
  transition: 'width 0.3s, padding 0.3s',
  justifyContent: 'space-between',
  marginRight: -8, // make room for tab's padding
  padding: '0 16px',
  flexShrink: 0,
  ['WebkitAppRegion' as string]: 'drag',
});
