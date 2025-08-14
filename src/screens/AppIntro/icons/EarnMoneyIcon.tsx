import React from 'react';
import { Circle, G, Path, Rect, Svg, Text } from 'react-native-svg';

export const EarnMoneyIcon: React.FC = () => (
  <Svg width='250' height='250' viewBox='0 0 300 300' fill='none'>
    <Circle cx='250' cy='230' r='15' fill='white' />
    <Circle cx='200' cy='70' r='5' fill='#6457F0' />
    <Circle cx='90' cy='240' r='8' fill='white' />
    <Circle cx='230' cy='190' r='12' fill='#FBBF24' stroke='white' strokeWidth='2' />
    <Text x='230' y='195' textAnchor='middle' fill='white' fontSize='14' fontWeight='bold'>
      $
    </Text>

    <G transform='translate(20, 50)'>
      <Rect x='80' y='30' width='80' height='150' rx='15' fill='white' stroke='#2d3748' strokeWidth='3' />
      <Rect x='90' y='40' width='60' height='130' fill='#F7FAFC' />
      <Path d='M120,130 a30,30 0 1,0 0,-0.001' fill='#FBBF24' stroke='#2d3748' strokeWidth='3' />
      <Text x='120' y='135' textAnchor='middle' fill='#2d3748' fontSize='24' fontWeight='bold'>
        $
      </Text>
    </G>

    <G transform='translate(0, 20)'>
      <Path d='M170 140 h90 v60 h-100 l-10 -20 h-10 v-40 z' fill='#6457F0' stroke='#2d3748' strokeWidth='3' />
      <Circle cx='240' cy='185' r='5' fill='white' />
      <Rect x='180' y='120' width='70' height='20' fill='white' stroke='#2d3748' strokeWidth='3' />
      <Rect x='185' y='110' width='60' height='10' fill='white' stroke='#2d3748' strokeWidth='3' />
      <Rect x='190' y='100' width='50' height='10' fill='#FBBF24' stroke='#2d3748' strokeWidth='3' />

      <Circle cx='215' cy='115' r='5' fill='#FBBF24' stroke='white' strokeWidth='1.5' />
      <Text x='215' y='118' textAnchor='middle' fill='white' fontSize='6' fontWeight='bold'>
        $
      </Text>

      <Circle cx='205' cy='105' r='3' fill='#48BB78' />
      <Circle cx='225' cy='105' r='3' fill='#48BB78' />
    </G>
  </Svg>
);
