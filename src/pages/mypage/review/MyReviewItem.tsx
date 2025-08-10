import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

import { Dropdown, DropdownItem } from '@/components/Dropdown';
import ReviewModal from '@/components/ReviewModal';
import CommonModal from '@/components/CommonModal';
import TempThumbnailSrc from '@/assets/images/temp-courseCard.png';
import StarIconSrc from '@/assets/icons/star-filled.svg';
import MoreIconSrc from '@/assets/icons/more-24px.svg';

const MyReviewItem = () => {
  const [t] = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const checkTextOverflow = (element: HTMLDivElement | null) => {
    if (element) {
      setNeedsTruncation(element.scrollHeight > element.clientHeight);
    }
  };

  // 더미 데이터 (실제로는 props로 받아올 데이터)
  const reviewData = {
    reviewId: 1,
    rating: 5,
    review:
      '바다 옆을 뛸 수 있어서 좋아요! 그런데 뱅뱅사거리 쯤 도로공사로 길이 좀 안좋네요 ㅠㅠ 그리고 근처 카페 coffee051 에서 커피 한 잔해도 바다 옆을 뛸 수 있어서 좋아요! 그런데 뱅뱅사거리 쯤 도로공사로 길이 좀 안좋네요 ㅠㅠ 그리고 근처 카페 coffee051 에서 커피 한 잔해도',
    courseId: 1,
  };

  const handleGoToReview = () => {
    // TODO: 해당 리뷰로 이동
    console.log('Go to review:', reviewData.reviewId);
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleEditConfirm = async (reviewText: string, newRating?: number) => {
    try {
      // TODO: API 호출
      console.log('Edit review:', { reviewText, newRating });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to edit review:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      // TODO: API 호출
      console.log('Delete review:', reviewData.reviewId);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  return (
    <Container>
      <ThumbnailWrapper>
        <Thumbnail src={TempThumbnailSrc} />
        <CourseStats>4km · 50분 · 100m</CourseStats>
      </ThumbnailWrapper>
      <ReviewInfo>
        <TitleWrapper>
          <Category>해운광안</Category>
          <Title>다대포-을숙도</Title>
        </TitleWrapper>
        <ContentWrapper>
          <RowWrapper>
            <StarWrapper>
              <Stars>
                <img src={StarIconSrc} width={12} height={12} /> {reviewData.rating}
              </Stars>
              <Divider />
              <ReviewDate>2025.01.01</ReviewDate>
            </StarWrapper>
            <Dropdown trigger={<img src={MoreIconSrc} alt="more" width={24} height={24} />} width={124}>
              <DropdownItem onClick={handleGoToReview}>{t('mypage.review.goToReview')}</DropdownItem>
              <DropdownItem onClick={handleEditClick}>{t('edit')}</DropdownItem>
              <DropdownItem onClick={handleDeleteClick} variant="danger">
                {t('delete')}
              </DropdownItem>
            </Dropdown>
          </RowWrapper>
          <ReviewWrapper>
            {isExpanded ? (
              <>
                <ReviewContents>
                  바다 옆을 뛸 수 있어서 좋아요! 그런데 뱅뱅사거리 쯤 도로공사로 길이 좀 안좋네요 ㅠㅠ 그리고 근처 카페 coffee051 에서 커피 한 잔해도
                  바다 옆을 뛸 수 있어서 좋아요! 그런데 뱅뱅사거리 쯤 도로공사로 길이 좀 안좋네요 ㅠㅠ 그리고 근처 카페 coffee051 에서 커피 한 잔해도
                </ReviewContents>
                <ToggleButton onClick={() => setIsExpanded(false)}>{t('courseDetail.collapse')}</ToggleButton>
              </>
            ) : (
              <ReviewTruncated>
                <ReviewContents ref={checkTextOverflow}>
                  바다 옆을 뛸 수 있어서 좋아요! 그런데 뱅뱅사거리 쯤 도로공사로 길이 좀 안좋네요 ㅠㅠ 그리고 근처 카페 coffee051 에서 커피 한 잔해도
                  바다 옆을 뛸 수 있어서 좋아요! 그런데 뱅뱅사거리 쯤 도로공사로 길이 좀 안좋네요 ㅠㅠ 그리고 근처 카페 coffee051 에서 커피 한 잔해도
                </ReviewContents>
                {needsTruncation && <ToggleButtonInline onClick={() => setIsExpanded(true)}>{t('courseDetail.more')}</ToggleButtonInline>}
              </ReviewTruncated>
            )}
          </ReviewWrapper>
        </ContentWrapper>
      </ReviewInfo>

      <ReviewModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleEditConfirm}
        confirmText={t('modal.reviewModal.edit')}
        mode="edit"
        initialRating={reviewData.rating}
        initialReviewText={reviewData.review}
      />
      <CommonModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        content={t('modal.reviewModal.deleteWarning')}
        cancelText={t('modal.reviewModal.deleteCancel')}
        confirmText={t('modal.reviewModal.deleteConfirm')}
      />
    </Container>
  );
};

export default MyReviewItem;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
  gap: var(--spacing-16);
`;

const ThumbnailWrapper = styled.div`
  width: 260px;
  height: 260px;
  border-radius: 4px;
  position: relative;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
`;

const CourseStats = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 49px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%);
  color: var(--text-text-inverse, #ffffff);
  ${theme.typography.body2}
  padding: 0 var(--spacing-8) 4px var(--spacing-8);
  border-radius: 0 0 4px 4px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const ReviewInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: var(--spacing-12);
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-4);
`;

const Category = styled.span`
  ${theme.typography.caption2};
  color: var(--GrayScale-gray600, #777777);
`;

const Title = styled.div`
  ${theme.typography.subtitle2};
  color: var(--text-text-title, #1c1c1c);
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-4);
  width: 100%;
`;

const RowWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const StarWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
`;

const Stars = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  ${theme.typography.body2};
  color: var(--text-text-title, #1c1c1c);
`;

const Divider = styled.div`
  width: 1px;
  height: 10px;
  background-color: var(--line-line-001, #eeeeee);
`;

const ReviewDate = styled.div`
  ${theme.typography.body2};
  color: var(--text-text-secondary, #555555);
`;

const ReviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

const ReviewTruncated = styled.div`
  position: relative;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  width: 100%;
`;

const ReviewContents = styled.div`
  ${theme.typography.body2};
  color: var(--text-text-secondary, #555555);
`;

const ToggleButton = styled.button`
  ${theme.typography.caption1};
  color: var(--text-text-disabled, #bbbbbb);
  align-self: flex-start;
  padding: 0;
  margin-top: 4px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const ToggleButtonInline = styled.button`
  ${theme.typography.caption1};
  color: var(--text-text-disabled, #bbbbbb);
  position: absolute;
  bottom: 0;
  right: 0;
  background: white;
  padding-left: 2px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
