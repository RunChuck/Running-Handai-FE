import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as S from '../MyPage.styled';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';
import { useToast } from '@/hooks/useToast';

import MyCourseCard from './MyCourseCard';
import SVGColor from '@/components/SvgColor';
import PenIconSrc from '@/assets/icons/pen-default.svg';
import ArrowIconSrc from '@/assets/icons/arrow-right-16px.svg';

interface MyCourseSectionProps {
  isAuthenticated: boolean;
}

const MyCourseSection = ({ isAuthenticated }: MyCourseSectionProps) => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const { scrollContainerRef, handleMouseDown, handleWheel } = useHorizontalScroll();
  const { showInfoToast } = useToast();

  // 테스트용
  const myCourseCount = 0;

  const handleGoToCreateCourse = () => {
    showInfoToast(t('toast.preparing'), { position: 'top' });
  };

  return (
    <S.SectionContainer2>
      <S.SectionTitleWrapper>
        <S.SectionTitle>
          <img src={PenIconSrc} />
          {t('mypage.myCourse')}
        </S.SectionTitle>
        {isAuthenticated && myCourseCount > 0 && (
          <S.MoreButton onClick={handleGoToCreateCourse}>
            {t('mypage.more')}
            <SVGColor src={ArrowIconSrc} width={16} height={16} color="#BBBBBB" />
          </S.MoreButton>
        )}
      </S.SectionTitleWrapper>
      {isAuthenticated ? (
        myCourseCount > 0 ? (
          <S.CardList ref={scrollContainerRef} onMouseDown={handleMouseDown} onWheel={handleWheel}>
            <MyCourseCard />
            <MyCourseCard />
            <MyCourseCard />
          </S.CardList>
        ) : (
          <S.SectionContent>
            <S.ContentDescription>{t('mypage.myCourse.desc')}</S.ContentDescription>
            <S.CtaButton onClick={handleGoToCreateCourse}>{t('mypage.goToCreateCourse')}</S.CtaButton>
          </S.SectionContent>
        )
      ) : (
        <S.SectionContent>
          <S.ContentDescription>{t('mypage.myCourse.desc')}</S.ContentDescription>
          <S.CtaButton onClick={() => navigate('/')}>{t('mypage.login')}</S.CtaButton>
        </S.SectionContent>
      )}
    </S.SectionContainer2>
  );
};

export default MyCourseSection;
