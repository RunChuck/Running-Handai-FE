import type { AreaCode } from '@/types/course';

export const areaCodeToDisplayName: Record<AreaCode, string> = {
  HAEUN_GWANGAN: '해운 · 광안',
  SONGJEONG_GIJANG: '송정 · 기장',
  SEOMYEON_DONGNAE: '서면 · 동래',
  WONDOSIM: '원도심 · 영도',
  SOUTHERN_COAST: '남부해안',
  WESTERN_NAKDONGRIVER: '서부낙동강',
  NORTHERN_BUSAN: '북부산',
  ETC: '기타',
};

export const getAreaDisplayName = (areaCode: AreaCode): string => {
  return areaCodeToDisplayName[areaCode] || areaCode;
};
