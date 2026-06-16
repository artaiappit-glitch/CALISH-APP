import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { colors, typography, weightToFamily, type TypeVariant } from '../../theme/tokens';

type Props = RNTextProps & {
  variant?: TypeVariant;
  color?: string;
  /** Override the variant's weight (still resolves to an Inter family). */
  weight?: '300' | '400' | '500' | '600' | '700';
};

/**
 * Token-driven text. Every font size / line-height / family in the app comes
 * through here so the type scale stays in lockstep with tokens.ts.
 */
export default function Text({ variant = 'body', color = colors.ink, weight, style, ...rest }: Props) {
  const t = typography[variant];
  const resolvedWeight = weight ?? t.weight;
  const base = {
    fontFamily: weightToFamily[resolvedWeight] ?? typography.family.regular,
    fontSize: t.fontSize,
    lineHeight: t.lineHeight,
    letterSpacing: 'letterSpacing' in t ? t.letterSpacing : 0,
    color,
  };
  return <RNText {...rest} style={[base, style]} />;
}

export const textStyles = StyleSheet.create({});
