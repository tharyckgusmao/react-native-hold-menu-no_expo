import { IS_IOS } from '../../constants';

export const BACKDROP_LIGHT_BACKGROUND_COLOR = IS_IOS
  ? 'rgba(0,0,0,0.2)'
  : 'rgba(19, 19, 19, 0.3)';
export const BACKDROP_DARK_BACKGROUND_COLOR = IS_IOS
  ? 'rgba(0,0,0,0.75)'
  : 'rgba(0,0,0,0.95)';
