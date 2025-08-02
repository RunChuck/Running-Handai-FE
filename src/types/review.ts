export interface ReviewData {
  starAverage: number;
  reviewCount: number;
  reviewInfoDtos: ReviewInfoDto[];
}

export interface ReviewInfoDto {
  reviewId: number;
  stars: number;
  contents: string;
  writerNickname: string;
  isMyReview: boolean;
  createdAt: string;
}

export interface GetReviewRequest {
  courseId: number;
}

export interface GetReviewResponse {
  statusCode: number;
  responseCode: string;
  message: string;
  totalCount: number;
  data: ReviewData;
}

export interface CreateReviewRequest {
  courseId: number;
  stars: number;
  contents: string;
}

export interface CreateReviewResponse {
  statusCode: number;
  responseCode: string;
  message: string;
  totalCount: number;
  data: ReviewInfoDto;
}

export interface DeleteReviewRequest {
  reviewId: number;
}

export interface DeleteReviewResponse {
  statusCode: number;
  responseCode: string;
  message: string;
  totalCount: number;
  data: [];
}

export interface EditReviewRequest {
  reviewId: number;
  stars?: number;
  contents?: string;
}

export interface EditReviewResponse {
  statusCode: number;
  responseCode: string;
  message: string;
  totalCount: number;
  data: ReviewInfoDto;
}
