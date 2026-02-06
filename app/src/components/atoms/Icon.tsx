/**
 * Icon Atom
 *
 * Wrapper around Phosphor icons with token-based defaults.
 * Provides consistent icon sizing and colors across the app.
 */

import React from 'react';
import * as PhosphorIcons from 'phosphor-react-native';
import { colors } from '../../tokens';

// Supported icon names (add more as needed)
export type IconName =
  | 'House'
  | 'MagnifyingGlass'
  | 'Plus'
  | 'Books'
  | 'Gear'
  | 'SlidersHorizontal'
  | 'ChefHat'
  | 'CaretLeft'
  | 'CaretRight'
  | 'X'
  | 'Check'
  | 'Heart'
  | 'Star'
  | 'Camera'
  | 'Image'
  | 'Trash'
  | 'PencilSimple'
  | 'Clock'
  | 'Calendar'
  | 'Tag'
  | 'FunnelSimple'
  | 'SortAscending'
  | 'DotsThree'
  | 'Info'
  | 'Warning'
  | 'WarningCircle'
  | 'Knife'
  | 'Fire'
  | 'Sparkle'
  | 'Sun'
  | 'SunHorizon'
  | 'MoonStars';

type IconWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';

export interface IconProps {
  /** Icon name from Phosphor */
  name: IconName;
  /** Size in pixels (default: 24) */
  size?: number;
  /** Color (default: colors.icon.default) */
  color?: string;
  /** Weight/style (default: 'regular') */
  weight?: IconWeight;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = colors.icon.default,
  weight = 'regular',
}) => {
  const IconComponent = PhosphorIcons[name] as React.ComponentType<{
    size: number;
    color: string;
    weight: IconWeight;
  }>;

  if (!IconComponent) {
    if (__DEV__) {
      console.warn(`Icon "${name}" not found in Phosphor icons`);
    }
    return null;
  }

  // Note: Phosphor icons don't have accessibilityLabel prop directly,
  // wrap in View with accessibility props if needed at call site
  return <IconComponent size={size} color={color} weight={weight} />;
};

Icon.displayName = 'Icon';
