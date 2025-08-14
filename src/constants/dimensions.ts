// src/utils/constants/dimensions.ts
import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const DIMENSIONS = {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  IS_SMALL_DEVICE: SCREEN_WIDTH < 375,
  IS_LARGE_DEVICE: SCREEN_WIDTH >= 414,
  PIXEL_RATIO: PixelRatio.get(),
  FONT_SCALE: PixelRatio.getFontScale(),
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
} as const;
