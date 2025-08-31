export interface GPXPoint {
  lat: number;
  lng: number;
  ele?: number;
}

export interface GPXData {
  name: string;
  points: GPXPoint[];
}

export const parseGPX = (gpxString: string): GPXData => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(gpxString, 'application/xml');

  // GPX 파일명 추출
  const nameElement = doc.querySelector('name');
  const name = nameElement?.textContent || 'Unknown Route';

  const points: GPXPoint[] = [];

  const parsePoint = (element: Element) => {
    const lat = parseFloat(element.getAttribute('lat') || '0');
    const lng = parseFloat(element.getAttribute('lon') || element.getAttribute('lng') || '0');

    let ele: number | undefined;
    const eleElement = element.querySelector('ele');
    if (eleElement && eleElement.textContent) {
      ele = parseFloat(eleElement.textContent);
    } else {
      const elevationAttr = element.getAttribute('elevation') || element.getAttribute('ele');
      if (elevationAttr) {
        ele = parseFloat(elevationAttr);
      }
    }

    return { lat, lng, ele };
  };

  // 1. Track points (trkpt)
  const trkpts = doc.querySelectorAll('trkpt');
  trkpts.forEach(trkpt => {
    const point = parsePoint(trkpt);
    if (point.lat !== 0 && point.lng !== 0) {
      points.push(point);
    }
  });

  // 2. Route points (rtept)
  if (points.length === 0) {
    const rtepts = doc.querySelectorAll('rtept');
    rtepts.forEach(rtept => {
      const point = parsePoint(rtept);
      if (point.lat !== 0 && point.lng !== 0) {
        points.push(point);
      }
    });
  }

  // 3. Waypoints (wpt)
  if (points.length === 0) {
    const wpts = doc.querySelectorAll('wpt');
    wpts.forEach(wpt => {
      const point = parsePoint(wpt);
      if (point.lat !== 0 && point.lng !== 0) {
        points.push(point);
      }
    });
  }

  return { name, points };
};
