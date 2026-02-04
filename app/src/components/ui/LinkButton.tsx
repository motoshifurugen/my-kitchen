/**
 * LinkButton Component
 *
 * Alias for Button with variant="tertiary".
 * Text-only action for secondary actions like "スキップ", "あとで設定する".
 */

import React from 'react';
import { Button, ButtonProps } from './Button';

export interface LinkButtonProps extends Omit<ButtonProps, 'variant'> {
  /** LinkButton is always tertiary variant */
}

export const LinkButton: React.FC<LinkButtonProps> = (props) => {
  return <Button {...props} variant="tertiary" />;
};

LinkButton.displayName = 'LinkButton';

