import type { ThemeCode } from '@/types/course';

export const THEME_CARDS = [
  { key: 'SEA' as ThemeCode, titleKey: 'theme.seaCourse', descriptionKey: 'theme.seaDescription' },
  { key: 'MOUNTAIN' as ThemeCode, titleKey: 'theme.mountainCourse', descriptionKey: 'theme.mountainDescription' },
  { key: 'DOWNTOWN' as ThemeCode, titleKey: 'theme.downtownCourse', descriptionKey: 'theme.downtownDescription' },
  { key: 'RIVERSIDE' as ThemeCode, titleKey: 'theme.riversideCourse', descriptionKey: 'theme.riversideDescription' },
] as const;
