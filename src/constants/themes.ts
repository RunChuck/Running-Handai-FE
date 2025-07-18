import type { ThemeCode } from '@/types/course';

export const THEME_CARDS = [
  { key: 'SEA' as ThemeCode, title: '오션뷰 코스', description: '바다와 함께하는 러닝' },
  { key: 'MOUNTAIN' as ThemeCode, title: '트레일 코스', description: '숲속을 달리는 러닝' },
  { key: 'DOWNTOWN' as ThemeCode, title: '도심 코스', description: '도심 속에서 가볍게 러닝' },
  { key: 'RIVERSIDE' as ThemeCode, title: '강변 코스', description: '강변을 따라 달리는 러닝' },
] as const;
