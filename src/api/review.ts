import { http } from '@/constants/http';
import type {
  GetReviewRequest,
  GetReviewResponse,
  CreateReviewRequest,
  CreateReviewResponse,
  DeleteReviewRequest,
  DeleteReviewResponse,
  EditReviewRequest,
  EditReviewResponse,
} from '@/types/review';

const PREFIX = '/api/courses';

export const reviewAPI = {
  getReviews: async (request: GetReviewRequest) => {
    const response = await http.get<GetReviewResponse>(`${PREFIX}/${request.courseId}/reviews`);
    return response.data;
  },

  createReview: async (request: CreateReviewRequest) => {
    const response = await http.post<CreateReviewResponse>(`${PREFIX}/${request.courseId}/reviews`, {
      stars: request.stars,
      contents: request.contents,
    });
    return response.data;
  },

  deleteReview: async (request: DeleteReviewRequest) => {
    const response = await http.delete<DeleteReviewResponse>(`api/reviews/${request.reviewId}`);
    return response.data;
  },

  editReview: async (request: EditReviewRequest) => {
    const response = await http.patch<EditReviewResponse>(`api/reviews/${request.reviewId}`, {
      stars: request.stars,
      contents: request.contents,
    });
    return response.data;
  },
};
