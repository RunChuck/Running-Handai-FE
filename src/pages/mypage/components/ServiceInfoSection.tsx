import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import * as S from '../MyPage.styled';
import { theme } from '@/styles/theme';
import { APP_VERSION } from '@/constants/version';

import SVGColor from '@/components/SvgColor';
import ArrowIconSrc from '@/assets/icons/arrow-right-16px.svg';

const getServiceItemData = (t: (key: string) => string) => [
  {
    id: 1,
    title: t('mypage.service.serviceIntroduction'),
    icon: ArrowIconSrc,
    link: 'https://runninghandai.notion.site/2490df91dcd7805ab556ccfa7bf48205',
  },
  {
    id: 2,
    title: t('mypage.service.terms'),
    icon: ArrowIconSrc,
    link: 'https://www.notion.so/runninghandai/22c0df91dcd780769296f16455e556db',
  },
  {
    id: 3,
    title: t('mypage.service.locationTerms'),
    icon: ArrowIconSrc,
    link: 'https://www.notion.so/runninghandai/22c0df91dcd78068ac28ef684f10a4eb',
  },
  {
    id: 4,
    title: t('mypage.service.privacyPolicy'),
    icon: ArrowIconSrc,
    link: 'https://www.notion.so/runninghandai/22c0df91dcd780208985c3167838daf8',
  },
  {
    id: 5,
    title: t('mypage.service.version'),
    version: APP_VERSION,
    link: '',
  },
];

const ServiceInfoSection = () => {
  const [t] = useTranslation();
  const serviceItemData = getServiceItemData(t);

  const handleItemClick = (link: string) => {
    if (!link) return;

    window.open(link, '_blank');
  };

  return (
    <>
      <S.SectionDivider />
      <S.SectionContainer2>
        <SectionTitle>{t('mypage.service.title')}</SectionTitle>
        {serviceItemData.map(item => (
          <ServiceItem key={item.id} onClick={() => handleItemClick(item.link)}>
            <div>{item.title}</div>
            {item.icon && <SVGColor src={item.icon} width={16} height={16} color="#BBBBBB" />}
            {item.version && <div>{item.version}</div>}
          </ServiceItem>
        ))}
      </S.SectionContainer2>
    </>
  );
};

export default ServiceInfoSection;

const SectionTitle = styled.div`
  ${theme.typography.body2};
  color: var(--text-text-secondary, #555555);
`;

const ServiceItem = styled.div`
  display: flex;
  justify-content: space-between;
  ${theme.typography.caption2};
  color: var(--text-text-title, #1c1c1c);

  &:hover {
    color: var(--text-text-secondary, #555555);
    cursor: pointer;
  }
`;
