import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import type { Review } from '@/types/auth';
import { useReviews } from '@/hooks/useReviews';
import { formatDate } from '@/utils/dateFormat';
import { getAreaDisplayName } from '@/utils/areaCodeMap';

import { Dropdown, DropdownItem } from '@/components/Dropdown';
import ReviewModal from '@/components/ReviewModal';
import CommonModal from '@/components/CommonModal';
import TempThumbnailSrc from '@/assets/images/temp-courseCard.png';
import StarIconSrc from '@/assets/icons/star-filled.svg';
import MoreIconSrc from '@/assets/icons/more-24px.svg';

interface MyReviewItemProps {
  review: Review;
}

const MyReviewItem = ({ review }: MyReviewItemProps) => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { editReviewAsync, deleteReviewAsync, isEditing, isDeleting } = useReviews({
    courseId: review.courseId,
    skipQuery: true,
  });

  const checkTextOverflow = (element: HTMLDivElement | null) => {
    if (element) {
      setNeedsTruncation(element.scrollHeight > element.clientHeight);
    }
  };

  const handleGoToCourseDetail = () => {
    navigate(`/course-detail/${review.courseId}`);
  };

  const handleGoToReview = () => {
    navigate(`/course-detail/${review.courseId}?tab=reviews`);
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleEditConfirm = async (reviewText: string, newRating?: number) => {
    try {
      await editReviewAsync({
        reviewId: review.reviewId,
        stars: newRating || review.stars,
        contents: reviewText,
      });

      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to edit review:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteReviewAsync({
        reviewId: review.reviewId,
      });

      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  return (
    <Container>
      <ThumbnailWrapper onClick={handleGoToCourseDetail}>
        <Thumbnail src={review.thumbnailUrl || TempThumbnailSrc} />
        <CourseStats>
          {review.distance}km · {review.duration}분 · {review.maxElevation}m
        </CourseStats>
      </ThumbnailWrapper>
      <ReviewInfo>
        <TitleWrapper>
          <Category>{getAreaDisplayName(review.area)}</Category>
          <Title>{review.courseName}</Title>
        </TitleWrapper>
        <ContentWrapper>
          <RowWrapper>
            <StarWrapper>
              <Stars>
                <img src={StarIconSrc} width={12} height={12} /> {review.stars}
              </Stars>
              <Divider />
              <ReviewDate>{formatDate(review.createdAt)}</ReviewDate>
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
                <ReviewContents>{review.contents}</ReviewContents>
                <ToggleButton onClick={() => setIsExpanded(false)}>{t('courseDetail.collapse')}</ToggleButton>
              </>
            ) : (
              <ReviewTruncated>
                <ReviewContents ref={checkTextOverflow}>{review.contents}</ReviewContents>
                {needsTruncation && <ToggleButtonInline onClick={() => setIsExpanded(true)}>{t('courseDetail.more')}</ToggleButtonInline>}
              </ReviewTruncated>
            )}
          </ReviewWrapper>
        </ContentWrapper>
      </ReviewInfo>

      <ReviewModal
        isOpen={isEditModalOpen}
        onClose={() => !isEditing && setIsEditModalOpen(false)}
        onConfirm={handleEditConfirm}
        confirmText={t('modal.reviewModal.edit')}
        mode="edit"
        initialRating={review.stars}
        initialReviewText={review.contents}
      />
      <CommonModal
        isOpen={isDeleteModalOpen}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
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
  cursor: pointer;
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
