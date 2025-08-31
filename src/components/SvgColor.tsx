import React from 'react';
import { styled } from '@mui/material/styles';

export type SVGColorProps = React.ComponentProps<'img'> & {
  src: string;
  width: number | string;
  height: number | string;
  color?: string;
};

const hexToFilter = (hex: string): string => {
  const colorFilters: { [key: string]: string } = {
    '#1C1C1C': 'brightness(0) saturate(100%) invert(11%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(11%) contrast(100%)',
    '#4561FF': 'brightness(0) saturate(100%) invert(30%) sepia(96%) saturate(2446%) hue-rotate(220deg) brightness(93%) contrast(101%)',
    '#FF0000': 'brightness(0) saturate(100%) invert(25%) sepia(99%) saturate(7462%) hue-rotate(2deg) brightness(103%) contrast(97%)',
    '#00FF00': 'brightness(0) saturate(100%) invert(48%) sepia(99%) saturate(4464%) hue-rotate(86deg) brightness(118%) contrast(119%)',
    '#000000': 'brightness(0) saturate(100%) invert(0%)',
    '#FFFFFF': 'brightness(0) saturate(100%) invert(100%)',
    '#333333': 'brightness(0) saturate(100%) invert(20%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(20%) contrast(100%)',
    '#BBBBBB': 'brightness(0) saturate(100%) invert(75%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(105%) contrast(100%)',
  };

  if (colorFilters[hex.toUpperCase()]) {
    return colorFilters[hex.toUpperCase()];
  }

  return colorFilters['#1C1C1C'];
};

export function SVGColor({ src, width, height, color = '#1C1C1C', className, ...other }: SVGColorProps) {
  return <SvgImage src={src} width={width} height={height} className={className} alt="" filter={hexToFilter(color)} {...other} />;
}

const SvgImage = styled('img')<{ filter: string }>(({ filter }) => ({
  filter: filter,
}));

export default SVGColor;
