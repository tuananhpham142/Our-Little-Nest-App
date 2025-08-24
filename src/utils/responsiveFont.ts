import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// iPhone 11 baseline width
const guidelineBaseWidth = 375;

export function rf(size: number) {
  const scale = SCREEN_WIDTH / guidelineBaseWidth;
  const newSize = size * scale;
  const fontScale = PixelRatio.getFontScale();
  return Math.round(PixelRatio.roundToNearestPixel(newSize * fontScale));
}
