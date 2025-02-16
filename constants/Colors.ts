/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  primary: '#FF6B6B', // Warm red for main actions
  secondary: '#4ECDC4', // Teal for secondary actions
  student: '#FF8787', // Soft red for student theme
  chef: '#45B7AF', // Soft teal for chef theme
  background: '#F8F9FA', // Light gray background
  text: {
    primary: '#212529', // Dark gray for primary text
    secondary: '#868E96', // Medium gray for secondary text
    light: '#F8F9FA', // Light gray for text on dark backgrounds
  },
  border: {
    light: 'rgba(0, 0, 0, 0.1)',
  },
  input: {
    background: 'rgba(255, 255, 255, 0.8)',
    border: 'rgba(0, 0, 0, 0.1)',
  },
  error: {
    light: '#FF8787',
    dark: '#FF6B6B',
  },
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
