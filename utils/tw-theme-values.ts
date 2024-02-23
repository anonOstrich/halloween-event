import tailwindConfig from '@/tailwind.config';
import resolveConfig from 'tailwindcss/resolveConfig';

const fullConfig = resolveConfig(tailwindConfig);
const themeColors = fullConfig.theme?.colors!;

export function getTWThemeColor(colorName: string, darkMode: boolean) {
  return themeColors[darkMode ? `dark-${colorName}` : colorName].toString();
}
