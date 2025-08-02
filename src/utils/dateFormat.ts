/**
 * @param dateString - ISO 형식의 날짜 문자열
 * @returns 날짜 문자열 (예: "2024.01.15")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\./g, '.')
    .replace(/\s/g, '');
};
