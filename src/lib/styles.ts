/**
 * Shared style constants to avoid duplication
 */

export const FONT_STYLES = {
  fontFamily: 'Inter Tight',
  fontFeatureSettings: "'liga' off, 'clig' off",
} as const

export const TYPOGRAPHY = {
  h2SemiboldTight: {
    ...FONT_STYLES,
    fontSize: '40px',
    fontWeight: 600,
    lineHeight: '120%',
  },
  h6SemiboldTight: {
    ...FONT_STYLES,
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '120%',
  },
  h6MediumTight: {
    ...FONT_STYLES,
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: '120%',
  },
  h5SemiboldTight: {
    ...FONT_STYLES,
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: '21px',
  },
  h8MediumTight: {
    ...FONT_STYLES,
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: 'normal',
    letterSpacing: '0.36px',
  },
} as const
