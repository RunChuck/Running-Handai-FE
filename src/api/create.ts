import { http } from '@/constants/http';
import type { LocationCheckRequest, LocationCheckResponse, CourseCreateRequest, CourseCreateResponse } from '@/types/create';

const PREFIX = '/api/members/me';

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

  const response = await http.post<CourseCreateResponse>(`${PREFIX}/courses`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
