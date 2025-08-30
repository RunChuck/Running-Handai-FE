export interface LocationCheckRequest {
  lat: number;
  lon: number;
}

export interface LocationCheckResponse {
  statusCode: number;
  responseCode: string;
  message: string;
  data: boolean;
}

export interface CourseCreateRequest {
  startPointName: string;
  endPointName: string;
  gpxFile: File;
  thumbnailImage: File;
  isInsideBusan: boolean;
}

export interface CourseCreateResponse {
  statusCode: number;
  responseCode: string;
  message: string;
  data: number;
}
