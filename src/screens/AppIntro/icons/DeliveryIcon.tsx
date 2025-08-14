import React from 'react';
import { Circle, G, Path, Rect, Svg } from 'react-native-svg';

export const DeliveryIcon: React.FC = () => (
  <Svg width='250' height='250' viewBox='0 0 300 300' fill='none'>
    <Circle cx='250' cy='230' r='10' fill='white' fillOpacity='0.5' />
    <Circle cx='70' cy='180' r='15' fill='white' />
    <Circle cx='260' cy='60' r='8' fill='#FF9B39' />
    <G stroke='#2d3748' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round'>
      <Path d='M120 95H145V115H120V95Z' fill='white' />
      <Path d='M145 95H170V115H145V95Z' fill='white' />
      <Path d='M170 95H195V115H170V95Z' fill='white' />
      <Path d='M120 115H145V135H120V115Z' fill='white' />
      <Path d='M145 115H170V135H145V115Z' fill='#FF9B39' fillOpacity='0.7' />
      <Path d='M170 115H195V135H170V115Z' fill='white' />
      <Path d='M120 135H170V170H120V135Z' fill='white' />
      <Path d='M110 85h95v55h-95z M110 140h70v40h-70z' stroke='none' fill='none' />
      <Rect x='115' y='90' width='85' height='50' fill='none' />
      <Rect x='115' y='140' width='60' height='40' fill='none' />
      <Path d='M115 90 v50 h85 v-50 h-85' />
      <Path d='M115 140 v40 h60 v-40 h-60' />
      <Path d='M142.5 90v50 M170 90v50' />

      <Path d='M100 180H210' />
      <Path d='M185 180L210 230' stroke='#FF9B39' strokeWidth='10' />
      <Path d='M210 230H90' />
      <Path d='M115 180L90 230' />
      <Circle cx='100' cy='235' r='10' fill='white' />
      <Circle cx='205' cy='235' r='10' fill='white' />
    </G>
    <G fill='#2d3748'>
      <Path
        d='M105 100 A 15 15 0 0 1 120 85 L 120 70 A 5 5 0 0 1 130 65 A 5 5 0 0 1 140 70 L 140 75 L 130 80 L 130 90 A 15 15 0 0 0 105 100'
        fill='white'
        stroke='#2d3748'
        strokeWidth='3'
      />
      <Path d='M105 100v40h-5v-30a5 5 0 0 0 -10 0v30h-5v-40z' fill='#E2E8F0' stroke='#2d3748' strokeWidth='3' />
      <Path d='M105 100h20l-5 40h-15z' fill='white' stroke='#2d3748' strokeWidth='3' />
      <Path d='M85 140h-5l-5 25h10z' fill='white' stroke='#2d3748' strokeWidth='3' />
    </G>
  </Svg>
);
