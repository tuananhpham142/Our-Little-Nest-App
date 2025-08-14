import React from 'react';
import { Circle, G, Path, Svg, Text } from 'react-native-svg';

export const AcceptTripIcon: React.FC = () => (
  <Svg width='250' height='250' viewBox='0 0 300 300' fill='none'>
    <Circle cx='70' cy='240' r='8' fill='#FF9B39' />
    <Circle cx='230' cy='230' r='5' fill='#6457F0' />
    <Circle cx='80' cy='70' r='10' fill='#FF9B39' />
    <Circle cx='240' cy='110' r='8' fill='#6457F0' />

    <Path
      d='M120 100 C100 120, 100 250, 150 250 C200 250, 200 120, 180 100'
      stroke='#CBD5E0'
      strokeWidth='3'
      fill='none'
      strokeDasharray='5 5'
    />

    <G transform='translate(0, 10)'>
      <Path
        d='M196.8,223.2c-2.4-5.6-4.8-11.2-6.4-16.8c-2.4-9.6-1.6-20,4-28.8c4.8-8,12.8-12,21.6-13.6 c11.2-1.6,22.4,2.4,29.6,11.2c2.4,3.2,4.8,6.4,6.4,10.4c0,0-16.8,4-20.8,4.8c-1.6,0-3.2,0-4.8-0.8c-4-1.6-8-4-11.2-7.2 c-4.8-4.8-6.4-11.2-4.8-17.6c1.6-8,8.8-13.6,16.8-13.6c8,0,14.4,4.8,16.8,12c0.8,3.2,0.8,6.4,0,9.6c-4,13.6-16,24.8-29.6,28 c-8,1.6-16,0.8-23.2-3.2C212,230.4,196.8,223.2,196.8,223.2z'
        fill='none'
        stroke='#2d3748'
        strokeWidth='3'
      />
      <Path
        d='M226.4,166.4c-4.8-2.4-8.8-6.4-12-11.2c-4-5.6-6.4-12.8-5.6-20c0.8-10.4,7.2-19.2,16.8-23.2c12-4.8,25.6-1.6,34.4,8.8 c4.8,5.6,8,12.8,8.8,20c0.8,6.4-0.8,12.8-4,18.4'
        fill='none'
        stroke='#2d3748'
        strokeWidth='3'
      />

      <Path
        d='M120,74.4c0-11.2,8.8-20,20-20h52c11.2,0,20,8.8,20,20v104c0,11.2-8.8,20-20,20h-52c-11.2,0-20-8.8-20-20V74.4z'
        fill='white'
        stroke='#2d3748'
        strokeWidth='3'
      />
      <Path d='M152,62.4h28' stroke='#2d3748' strokeWidth='3' />
      <Path d='M128,198.4h76' stroke='#2d3748' strokeWidth='2' fill='none' />
      <Circle cx='166' cy='110' r='20' fill='#48BB78' />
      <Path d='M158 110 l6 6 l12 -12' stroke='white' strokeWidth='4' fill='none' strokeLinecap='round' />
      <Text x='166' y='155' textAnchor='middle' fill='#2d3748' fontSize='14' fontWeight='bold'>
        Accept Trip
      </Text>
    </G>
  </Svg>
);
