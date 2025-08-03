declare global {
  interface Window {
    Kakao: {
      init: (appKey: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (options: unknown) => void;
      };
    };
  }
}

// 카카오 SDK 초기화
export const initKakao = () => {
  if (typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
    const kakaoAppKey = import.meta.env.VITE_KAKAO_APP_KEY || 'YOUR_KAKAO_APP_KEY';
    window.Kakao.init(kakaoAppKey);
  }
};

// 카카오톡 공유하기
interface KakaoShareProps {
  title: string;
  description: string;
  imageUrl: string;
  webUrl: string;
}

export const shareToKakao = ({ title, description, imageUrl, webUrl }: KakaoShareProps) => {
  if (!window.Kakao || !window.Kakao.isInitialized()) {
    console.error('카카오 SDK가 초기화되지 않았습니다.');
    return;
  }

  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: title,
      description: description,
      imageUrl: imageUrl,
      link: {
        mobileWebUrl: webUrl,
        webUrl: webUrl,
      },
    },
    buttons: [
      {
        title: '러닝하러 가기',
        link: {
          mobileWebUrl: webUrl,
          webUrl: webUrl,
        },
      },
    ],
    installTalk: true,
  });
};
