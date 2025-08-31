export interface GPXTrackPoint {
  lat: number;
  lng: number;
  elevation?: number;
  time?: Date;
}

export interface GPXGenerateOptions {
  trackName?: string;
  description?: string;
  creator?: string;
}

export const generateGPXFile = (trackPoints: GPXTrackPoint[], options: GPXGenerateOptions = {}): File => {
  const { trackName = 'Course Track', description = 'Generated course track', creator = 'Running Handai' } = options;

  const currentTime = new Date().toISOString();

  // GPX 헤더
  const gpxHeader = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="${creator}" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${trackName}</name>
    <desc>${description}</desc>
    <time>${currentTime}</time>
  </metadata>
  <trk>
    <name>${trackName}</name>
    <trkseg>`;

  // 트랙 포인트들 생성
  const trackPointsXML = trackPoints
    .map((point, index) => {
      const time = point.time || new Date(Date.now() + index * 1000); // 1초 간격으로 시간 생성
      const elevation = point.elevation !== undefined ? point.elevation : 0;

      return `      <trkpt lat="${point.lat}" lon="${point.lng}">
        <ele>${elevation}</ele>
        <time>${time.toISOString()}</time>
      </trkpt>`;
    })
    .join('\n');

  // GPX 푸터
  const gpxFooter = `
    </trkseg>
  </trk>
</gpx>`;

  // 전체 GPX 문서
  const gpxContent = gpxHeader + '\n' + trackPointsXML + gpxFooter;

  // File 객체로 반환
  return new File([gpxContent], 'course.gpx', {
    type: 'application/gpx+xml',
    lastModified: Date.now(),
  });
};
