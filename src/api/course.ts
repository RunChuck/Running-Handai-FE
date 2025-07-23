import { http } from '@/constants/http';
import type { CourseRequest, CourseResponse, CourseDetailResponse, BookmarkRequest, BookmarkResponse } from '@/types/course';

const PREFIX = '/api/courses';

export const courseAPI = {
  getCourses: async (request: CourseRequest) => {
    const response = await http.get<CourseResponse>(`${PREFIX}`, { params: request });
    return response.data;
  },

  getCourseDetail: async (courseId: number) => {
    const response = await http.get<CourseDetailResponse>(`${PREFIX}/${courseId}`);
    return response.data;
  },

  bookmarkCourse: async (request: BookmarkRequest) => {
    const response = await http.post<BookmarkResponse>(`/api/bookmarks/${request.courseId}`, request);
    return response.data;
  },

  deleteBookmarkCourse: async (request: BookmarkRequest) => {
    const response = await http.delete<BookmarkResponse>(`/api/bookmarks/${request.courseId}`, { data: request });
    return response.data;
  },
};
