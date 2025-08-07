import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

import { Dropdown, DropdownItem } from './Dropdown';
import ReviewModal from './ReviewModal';
import CommonModal from './CommonModal';
import StarFilledIconSrc from '@/assets/icons/star-filled.svg';
import ProfileIconSrc from '@/assets/icons/profile-default.svg';
import MoreIconSrc from '@/assets/icons/more-24px.svg';

interface ReviewItemProps {
  reviewId: number;
  nickname: string;
  rating: number;
  date: string;
  review: string;
  isMyReview: boolean;
  onEditReview?: (reviewId: number, stars?: number, contents?: string) => Promise<void>;
  onDeleteReview?: (reviewId: number) => Promise<void>;
}

const ReviewItem = ({ reviewId, nickname, rating, date, review, isMyReview, onEditReview, onDeleteReview }: ReviewItemProps) => {
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

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleEditConfirm = async (reviewText: string, newRating?: number) => {
    if (onEditReview) {
      try {
        const changedStars = newRating !== rating ? newRating : undefined;
        const changedContents = reviewText !== review ? reviewText : undefined;

        await onEditReview(reviewId, changedStars, changedContents);
        setIsEditModalOpen(false);
      } catch (error) {
        console.error('Failed to edit review:', error);
      }
    }
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (onDeleteReview) {
      try {
        await onDeleteReview(reviewId);
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error('Failed to delete review:', error);
      }
    }
  };

  return (
    <Container>
      <UserInfo>
        <NicknameWrapper>
          <UserNickname>{nickname}</UserNickname>
          {isMyReview && <img src={ProfileIconSrc} alt="profile" width={14} height={14} />}
        </NicknameWrapper>
        {isMyReview && (
          <Dropdown trigger={<img src={MoreIconSrc} alt="more" width={24} height={24} />}>
            <DropdownItem onClick={handleEditClick}>{t('edit')}</DropdownItem>
            <DropdownItem onClick={handleDeleteClick} variant="danger">
              {t('delete')}
            </DropdownItem>
          </Dropdown>
        )}
      </UserInfo>
      <RatingWrapper>
        <Rating>
          <img src={StarFilledIconSrc} alt="star" width={12} height={12} />
          {rating}
        </Rating>
        <Divider />
        <Date>{date}</Date>
      </RatingWrapper>
      <ReviewWrapper>
        {isExpanded ? (
          <>
            <Review>{review}</Review>
            <ToggleButton onClick={() => setIsExpanded(false)}>{t('courseDetail.collapse')}</ToggleButton>
          </>
        ) : (
          <ReviewTruncated>
            <Review ref={checkTextOverflow}>{review}</Review>
            {needsTruncation && <ToggleButtonInline onClick={() => setIsExpanded(true)}>{t('courseDetail.more')}</ToggleButtonInline>}
          </ReviewTruncated>
        )}
      </ReviewWrapper>

      <ReviewModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onConfirm={handleEditConfirm}
        confirmText={t('modal.reviewModal.edit')}
        mode="edit"
        initialRating={rating}
        initialReviewText={review}
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

export default ReviewItem;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--spacing-12) 0;
  gap: var(--spacing-4);
  border-top: 1px solid var(--line-line-001, #eeeeee);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-4);
`;

const NicknameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
`;

const UserNickname = styled.span`
  ${theme.typography.subtitle3};
  color: var(--text-text-title, #1c1c1c);
`;

const RatingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  ${theme.typography.body2};
  color: var(--text-text-title, #1c1c1c);
`;

const Divider = styled.div`
  width: 1px;
  height: 10px;
  background: var(--line-line-001, #eeeeee);
`;

const Date = styled.span`
  ${theme.typography.body2};
  color: var(--GrayScale-gray500, #999999);
`;

const ReviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ReviewTruncated = styled.div`
  position: relative;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Review = styled.div`
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
