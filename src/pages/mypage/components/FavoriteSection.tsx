import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as S from '../MyPage.styled';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';

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
  const { scrollContainerRef, handleMouseDown, handleWheel } = useHorizontalScroll();

  return (
    <S.SectionContainer>
      <S.SectionTitleWrapper>
        <S.SectionTitle>
          <SVGColor src={HeartIconSrc} width={16} height={16} color="#4561FF" />
          {t('mypage.favoriteCourse')}
        </S.SectionTitle>
        {isAuthenticated && (
          <S.MoreButton>
            {t('mypage.more')}
            <SVGColor src={ArrowIconSrc} width={16} height={16} color="#BBBBBB" />
          </S.MoreButton>
        )}
      </S.SectionTitleWrapper>
      {isAuthenticated ? (
        <S.CardList ref={scrollContainerRef} onMouseDown={handleMouseDown} onWheel={handleWheel}>
          <FavoriteCourseCard />
          <FavoriteCourseCard />
          <FavoriteCourseCard />
          <FavoriteCourseCard />
          <FavoriteCourseCard />
        </S.CardList>
      ) : (
        <S.SectionContent>
          <S.ContentDescription>{t('mypage.favoriteCourse.desc')}</S.ContentDescription>
          <S.LoginButton onClick={() => navigate('/')}>{t('mypage.login')}</S.LoginButton>
        </S.SectionContent>
      )}
    </S.SectionContainer>
  );
};

export default FavoriteSection;
