import { useNavigate } from 'react-router-dom';
import * as S from './CourseRecommendation.styled';

import BackIconSrc from '@/assets/icons/arrow-left-24px.svg';

const CourseRecommendation = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/main');
  };

  const handleOptionSelect = (option: string) => {
    console.log('선택된 옵션:', option);
    // TODO: 선택된 옵션 처리 로직
    navigate('/main');
  };

  return (
    <S.Container>
      <S.Header>
        <S.BackButton onClick={handleBackClick}>
          <img src={BackIconSrc} alt="뒤로가기" />
        </S.BackButton>
        <S.Title>🏃‍♂️ 추천 코스 탐색</S.Title>
      </S.Header>

      <S.Content>
        <S.Section>
          <S.Subtitle>어디로 가시나요?</S.Subtitle>
          <S.OptionGrid>
            <S.OptionButton onClick={() => handleOptionSelect('해운대')}>해운대</S.OptionButton>
            <S.OptionButton onClick={() => handleOptionSelect('송정기장')}>송정기장</S.OptionButton>
            <S.OptionButton onClick={() => handleOptionSelect('서면동래')}>서면동래</S.OptionButton>
            <S.OptionButton onClick={() => handleOptionSelect('원도심영도')}>원도심영도</S.OptionButton>
            <S.OptionButton onClick={() => handleOptionSelect('남부해안')}>남부해안</S.OptionButton>
            <S.OptionButton onClick={() => handleOptionSelect('서부낙동강')}>서부낙동강</S.OptionButton>
            <S.OptionButton onClick={() => handleOptionSelect('북부산')}>북부산</S.OptionButton>
          </S.OptionGrid>
        </S.Section>

        <S.Section>
          <S.Subtitle>어떤 테마로 원하세요?</S.Subtitle>
          <S.OptionGrid>
            <S.OptionButton onClick={() => handleOptionSelect('바다')}>바다</S.OptionButton>
            <S.OptionButton onClick={() => handleOptionSelect('강변')}>강변</S.OptionButton>
            <S.OptionButton onClick={() => handleOptionSelect('산')}>산</S.OptionButton>
            <S.OptionButton onClick={() => handleOptionSelect('도심')}>도심</S.OptionButton>
          </S.OptionGrid>
        </S.Section>
      </S.Content>
    </S.Container>
  );
};

export default CourseRecommendation;
