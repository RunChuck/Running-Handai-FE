import { http } from '@/constants/http';
import type { CourseRequest, CourseResponse, CourseDetailResponse, BookmarkResponse, AttractionResponse } from '@/types/course';

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

  bookmarkCourse: async (courseId: number) => {
    const response = await http.post<BookmarkResponse>(`${PREFIX}/${courseId}/bookmarks`);
    return response.data;
  },

  deleteBookmarkCourse: async (courseId: number) => {
    const response = await http.delete<BookmarkResponse>(`${PREFIX}/${courseId}/bookmarks`);
    return response.data;
  },

  getAttractions: async (courseId: number) => {
    const response = await http.get<AttractionResponse>(`${PREFIX}/${courseId}/spots`);
    return response.data;
  },
};
