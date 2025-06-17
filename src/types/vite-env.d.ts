/// <reference types="vite/client" />

declare module '*.gpx' {
  const src: string;
  export default src;
}

declare module '*.gpx?url' {
  const src: string;
  export default src;
}
