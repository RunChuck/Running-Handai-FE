import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as S from '../MyPage.styled';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useMyCourseActions } from '@/hooks/useMyCourses';

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
  const { scrollContainerRef, handleMouseDown } = useHorizontalScroll();

  const { data: userInfoResponse, isLoading } = useUserInfo();
  const userInfo = userInfoResponse?.data;
  const courses = userInfo?.myCourseInfo?.courses || [];
  const myCourseCount = userInfo?.myCourseInfo?.myCourseCount || 0;

  const { handleEdit, handleDelete } = useMyCourseActions();

  const handleGoToCreateCourse = () => {
    navigate('/course-creation');
  };

  const handleGoToMyCourse = () => {
    navigate('/mypage/mycourse');
  };

  return (
    <S.SectionContainer2>
      <S.SectionTitleWrapper>
        <S.SectionTitle>
          <img src={PenIconSrc} />
          {t('mypage.myCourse')}
          {myCourseCount > 0 && <S.CountText>{myCourseCount}</S.CountText>}
        </S.SectionTitle>
        {isAuthenticated && myCourseCount > 0 && (
          <S.MoreButton onClick={handleGoToMyCourse}>
            {t('mypage.more')}
            <SVGColor src={ArrowIconSrc} width={16} height={16} color="#BBBBBB" />
          </S.MoreButton>
        )}
      </S.SectionTitleWrapper>
      {isAuthenticated ? (
        isLoading ? (
          <S.LoadingContent>
            <S.ContentDescription>{t('loading')}</S.ContentDescription>
          </S.LoadingContent>
        ) : myCourseCount > 0 ? (
          <S.CardList ref={scrollContainerRef} onMouseDown={handleMouseDown}>
            {courses.map(course => (
              <MyCourseCard 
                key={course.courseId} 
                course={course} 
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
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
