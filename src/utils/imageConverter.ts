export interface ImageConvertOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

export const convertImageToWebP = async (
  blob: Blob,
  options: ImageConvertOptions = {}
): Promise<File> => {
  const {
    width,
    height,
    quality = 0.8,
    format = 'webp'
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context를 생성할 수 없습니다.'));
      return;
    }

    img.onload = () => {
      // 크기 지정이 없으면 원본 크기 사용
      const targetWidth = width || img.width;
      const targetHeight = height || img.height;
      
      // 캔버스 크기 설정
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      if (width && height) {
        // 크기가 지정된 경우: cover 방식으로 리사이즈
        const imgAspectRatio = img.width / img.height;
        const targetAspectRatio = targetWidth / targetHeight;

        let drawWidth: number;
        let drawHeight: number;
        let offsetX: number;
        let offsetY: number;

        if (imgAspectRatio > targetAspectRatio) {
          // 이미지가 더 넓음 - 높이 기준으로 맞추고 좌우 자름
          drawHeight = targetHeight;
          drawWidth = targetHeight * imgAspectRatio;
          offsetX = (targetWidth - drawWidth) / 2;
          offsetY = 0;
        } else {
          // 이미지가 더 높음 - 너비 기준으로 맞추고 상하 자름
          drawWidth = targetWidth;
          drawHeight = targetWidth / imgAspectRatio;
          offsetX = 0;
          offsetY = (targetHeight - drawHeight) / 2;
        }

        // 흰색 배경으로 초기화
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        // 이미지 그리기 (cover 방식)
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      } else {
        // 크기 지정이 없는 경우: 원본 그대로
        ctx.drawImage(img, 0, 0);
      }

      // WebP로 변환
      canvas.toBlob(
        (convertedBlob) => {
          if (convertedBlob) {
            const file = new File([convertedBlob], `thumbnail.${format}`, {
              type: `image/${format}`,
              lastModified: Date.now()
            });
            resolve(file);
          } else {
            reject(new Error('이미지 변환에 실패했습니다.'));
          }
        },
        `image/${format}`,
        quality
      );
    };

    img.onerror = () => {
      reject(new Error('이미지 로드에 실패했습니다.'));
    };

    // Blob을 이미지로 로드
    img.src = URL.createObjectURL(blob);
  });
};

// 브라우저 WebP 지원 여부 확인
export const isWebPSupported = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    canvas.toBlob(
      (blob) => {
        resolve(!!blob);
      },
      'image/webp'
    );
  });
};