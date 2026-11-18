import { Platform, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  const typeClassName = {
    small: 'text-sm leading-5 font-medium',
    smallBold: 'text-sm leading-5 font-bold',
    default: 'text-base leading-6 font-medium',
    title: 'text-[48px] leading-[52px] font-semibold',
    subtitle: 'text-[32px] leading-[44px] font-semibold',
    link: 'text-sm leading-[30px]',
    linkPrimary: 'text-sm leading-[30px] text-[#3c87f7]',
    code: 'text-xs',
  }[type];

  return (
    <Text
      className={typeClassName}
      style={[
        { color: theme[themeColor ?? 'text'] },
        type === 'code'
          ? { fontFamily: Fonts.mono, fontWeight: Platform.select({ android: 700 }) ?? 500 }
          : undefined,
        style,
      ]}
      {...rest}
    />
  );
}
