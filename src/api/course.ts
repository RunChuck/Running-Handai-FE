import { http } from '@/constants/http';
import type { CourseRequest, CourseResponse, CourseDetailResponse } from '@/types/course';

const PREFIX = '/api/courses';

export const courseAPI = {
  getCourses: async (request: CourseRequest) => {
    const response = await http.get<CourseResponse>(`${PREFIX}`, { params: request });
    return response.data;
  },

  getCourse: async (courseId: number) => {
    const response = await http.get<CourseDetailResponse>(`${PREFIX}/${courseId}`);
    return response.data;
  },
};
