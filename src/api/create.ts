import { http } from '@/constants/http';
import type {
  LocationCheckRequest,
  LocationCheckResponse,
  CourseCreateRequest,
  CourseCreateResponse,
  MyCoursesRequest,
  MyCoursesResponse,
  CourseUpdateRequest,
} from '@/types/create';

const PREFIX = '/api/members/me/courses';

export const checkIsInBusan = async (request: LocationCheckRequest): Promise<LocationCheckResponse> => {
  const response = await http.get<LocationCheckResponse>(`/api/locations/is-in-busan?lon=${request.lon}&lat=${request.lat}`);
  return response.data;
};

export const createCourse = async (request: CourseCreateRequest): Promise<CourseCreateResponse> => {
  const formData = new FormData();

  formData.append('startPointName', request.startPointName);
  formData.append('endPointName', request.endPointName);
  formData.append('gpxFile', request.gpxFile);
  formData.append('thumbnailImage', request.thumbnailImage);
  formData.append('isInsideBusan', request.isInsideBusan.toString());

  const response = await http.post<CourseCreateResponse>(`${PREFIX}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const getMyCourses = async (request: MyCoursesRequest = {}): Promise<MyCoursesResponse> => {
  const { sortBy = 'latest' } = request;
  const response = await http.get<MyCoursesResponse>(`${PREFIX}?sortBy=${sortBy}`);
  return response.data;
};

export const deleteCourse = async (courseId: number): Promise<CourseCreateResponse> => {
  const response = await http.delete<CourseCreateResponse>(`${PREFIX}/${courseId}`);
  return response.data;
};

export const updateCourse = async (courseId: number, request: CourseUpdateRequest): Promise<CourseCreateResponse> => {
  const formData = new FormData();

  formData.append('startPointName', request.startPointName);
  formData.append('endPointName', request.endPointName);

  if (request.thumbnailImage) {
    formData.append('thumbnailImage', request.thumbnailImage);
  }

  const response = await http.patch<CourseCreateResponse>(`${PREFIX}/${courseId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const downloadGpx = async (courseId: number): Promise<string> => {
  const response = await http.get<{ data: { courseId: number; gpxPath: string } }>(`${PREFIX}/${courseId}/gpx`);
  return response.data.data.gpxPath;
};
