import { cssVar } from '@toeverything/theme';
import { style } from '@vanilla-extract/css';

// TODO(@CatsJuice): new variables are ready in design system
export const root = style({
  width: 32,
  height: 32,
  borderRadius: 8,
  boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.15)',
  border: `1px solid ${cssVar('borderColor')}`,
  background: cssVar('white30'),
});
export const icon = style({
  color: cssVar('iconColor'),
  fontSize: 20,
  display: 'block',
});
