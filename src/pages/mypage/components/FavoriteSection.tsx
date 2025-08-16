import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as S from '../MyPage.styled';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';
import { useFavorites } from '@/hooks/useFavorites';

import FavoriteCourseCard from './FavoriteCourseCard';
import SVGColor from '@/components/SvgColor';
import HeartIconSrc from '@/assets/icons/heart-default.svg';
import ArrowIconSrc from '@/assets/icons/arrow-right-16px.svg';

interface FavoriteSectionProps {
  isAuthenticated: boolean;
}

const FavoriteSection = ({ isAuthenticated }: FavoriteSectionProps) => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const { scrollContainerRef, handleMouseDown } = useHorizontalScroll();

  const { data: favoriteCourseData, isLoading } = useFavorites({ area: null });
  const favoriteCourses = favoriteCourseData?.data || [];
  const displayedCourses = favoriteCourses.slice(0, 5);
  const favoriteCourseCount = favoriteCourses.length;

  return (
    <S.SectionContainer>
      <S.SectionTitleWrapper>
        <S.SectionTitle>
          <SVGColor src={HeartIconSrc} width={16} height={16} color="#4561FF" />
          {t('mypage.favoriteCourse')}
          {favoriteCourseCount > 0 && <S.CountText>{favoriteCourseCount}</S.CountText>}
        </S.SectionTitle>
        {isAuthenticated && favoriteCourseCount > 0 && (
          <S.MoreButton onClick={() => navigate('/mypage/favorites')}>
            {t('mypage.more')}
            <SVGColor src={ArrowIconSrc} width={16} height={16} color="#BBBBBB" />
          </S.MoreButton>
        )}
      </S.SectionTitleWrapper>
      {isAuthenticated ? (
        isLoading ? (
          <S.SectionContent>
            <S.ContentDescription>{t('loading')}</S.ContentDescription>
          </S.SectionContent>
        ) : favoriteCourseCount > 0 ? (
          <S.CardList ref={scrollContainerRef} onMouseDown={handleMouseDown}>
            {displayedCourses.map(course => (
              <FavoriteCourseCard key={course.courseId} course={course} />
            ))}
          </S.CardList>
        ) : (
          <S.SectionContent>
            <S.ContentDescription>{t('mypage.favoriteCourse.desc')}</S.ContentDescription>
            <S.CtaButton onClick={() => navigate('/course')}>{t('mypage.goToCourse')}</S.CtaButton>
          </S.SectionContent>
        )
      ) : (
        <S.SectionContent>
          <S.ContentDescription>{t('mypage.favoriteCourse.desc')}</S.ContentDescription>
          <S.CtaButton onClick={() => navigate('/')}>{t('mypage.login')}</S.CtaButton>
        </S.SectionContent>
      )}
    </S.SectionContainer>
  );
};

export default FavoriteSection;

