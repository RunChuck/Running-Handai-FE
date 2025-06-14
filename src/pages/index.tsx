import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--spacing-24);
  gap: var(--spacing-24);
`;

const Title = styled.h1`
  font-size: ${theme.typography.title1.fontSize};
  font-weight: ${theme.typography.title1.fontWeight};
  line-height: ${theme.typography.title1.lineHeight};
  color: var(--text-text-title);
  text-align: center;
  margin-bottom: var(--spacing-16);
`;

const Subtitle = styled.p`
  font-size: ${theme.typography.body1.fontSize};
  font-weight: ${theme.typography.body1.fontWeight};
  line-height: ${theme.typography.body1.lineHeight};
  color: var(--text-text-secondary);
  text-align: center;
  max-width: 400px;
`;

const TypographyDemo = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
  width: 100%;
  max-width: 400px;
  margin-top: var(--spacing-32);
`;

const ColorDemo = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);
  width: 100%;
  max-width: 400px;
  margin-top: var(--spacing-40);
  padding: var(--spacing-24);
  background-color: var(--surface-surface-highlight);
`;

const ColorSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
`;

const ColorRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
`;

const ColorBox = styled.div<{ color: string }>`
  width: var(--spacing-32);
  height: var(--spacing-32);
  background-color: var(${props => props.color});
  border: 1px solid var(--line-line-001);
  flex-shrink: 0;
`;

const ColorLabel = styled.span`
  font-size: ${theme.typography.caption1.fontSize};
  font-weight: ${theme.typography.caption1.fontWeight};
  color: var(--text-text-title);
  min-width: 120px;
`;

const ColorCode = styled.span`
  font-size: ${theme.typography.caption2.fontSize};
  font-weight: ${theme.typography.caption2.fontWeight};
  color: var(--text-text-secondary);
  font-family: 'Monaco', 'Menlo', monospace;
`;

const Title1 = styled.h1`
  font-size: ${theme.typography.title1.fontSize};
  font-weight: ${theme.typography.title1.fontWeight};
  line-height: ${theme.typography.title1.lineHeight};
  color: var(--text-text-title);
  margin: 0;
`;

const Title2 = styled.h2`
  font-size: ${theme.typography.title2.fontSize};
  font-weight: ${theme.typography.title2.fontWeight};
  line-height: ${theme.typography.title2.lineHeight};
  color: var(--text-text-title);
  margin: 0;
`;

const Subtitle1 = styled.h3`
  font-size: ${theme.typography.subtitle1.fontSize};
  font-weight: ${theme.typography.subtitle1.fontWeight};
  line-height: ${theme.typography.subtitle1.lineHeight};
  color: var(--text-text-title);
  margin: 0;
`;

const Subtitle2 = styled.h4`
  font-size: ${theme.typography.subtitle2.fontSize};
  font-weight: ${theme.typography.subtitle2.fontWeight};
  line-height: ${theme.typography.subtitle2.lineHeight};
  color: var(--text-text-title);
  margin: 0;
`;

const Body1 = styled.p`
  font-size: ${theme.typography.body1.fontSize};
  font-weight: ${theme.typography.body1.fontWeight};
  line-height: ${theme.typography.body1.lineHeight};
  color: var(--text-text-title);
  margin: 0;
`;

const Body2 = styled.p`
  font-size: ${theme.typography.body2.fontSize};
  font-weight: ${theme.typography.body2.fontWeight};
  line-height: ${theme.typography.body2.lineHeight};
  color: var(--text-text-secondary);
  margin: 0;
`;

const Caption1 = styled.span`
  font-size: ${theme.typography.caption1.fontSize};
  font-weight: ${theme.typography.caption1.fontWeight};
  line-height: ${theme.typography.caption1.lineHeight};
  color: var(--text-text-secondary);
`;

const Caption2 = styled.span`
  font-size: ${theme.typography.caption2.fontSize};
  font-weight: ${theme.typography.caption2.fontWeight};
  line-height: ${theme.typography.caption2.lineHeight};
  color: var(--text-text-disabled);
`;

const PrimaryText = styled.span`
  color: var(--text-text-primary);
  font-weight: 600;
`;

const LinkText = styled.a`
  color: var(--text-text-link);
  text-decoration: underline;
  cursor: pointer;
`;

const ErrorText = styled.span`
  color: var(--text-text-error);
  font-weight: 500;
`;

const SuccessText = styled.span`
  color: var(--text-text-success);
  font-weight: 500;
`;

const InfoText = styled.span`
  color: var(--text-text-info);
  font-weight: 500;
`;

const Button = styled.button`
  padding: var(--spacing-8) var(--spacing-24);
  color: var(--text-text-inverse);
  background-color: var(--text-text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: var(--spacing-16);
  font-size: 1rem;
  font-weight: 500;

  &:hover {
    background-color: var(--brand-primary-hover);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SectionTitle = styled.h3`
  font-size: ${theme.typography.subtitle1.fontSize};
  font-weight: ${theme.typography.subtitle1.fontWeight};
  line-height: ${theme.typography.subtitle1.lineHeight};
  color: var(--text-text-title);
  margin: 0 0 var(--spacing-16) 0;
  text-align: center;
`;

const LoginPage = () => {
  return (
    <Container>
      <Title>Running Handai</Title>
      <Subtitle>새로운 컬러 시스템과 타이포그래피가 적용되었습니다!</Subtitle>

      <TypographyDemo>
        <Title1>타이틀1 - SemiBold 28px (1.75rem)</Title1>
        <Title2>타이틀2 - SemiBold 24px (1.5rem)</Title2>
        <Subtitle1>서브타이틀1 - SemiBold 20px (1.25rem)</Subtitle1>
        <Subtitle2>서브타이틀2 - SemiBold 18px (1.125rem)</Subtitle2>
        <Body1>바디1 - Regular 16px (1rem) 기본 본문 텍스트입니다.</Body1>
        <Body2>바디2 - Regular 14px (0.875rem) 작은 본문 텍스트입니다.</Body2>
        <Caption1>캡션1 - SemiBold 14px (0.875rem) | </Caption1>
        <Caption2>캡션2 - SemiBold 13px (0.8125rem)</Caption2>

        <div style={{ marginTop: 'var(--spacing-16)' }}>
          <PrimaryText>Primary 텍스트</PrimaryText> |
          <LinkText> Link 텍스트</LinkText> |
          <ErrorText> Error 텍스트</ErrorText> |
          <SuccessText> Success 텍스트</SuccessText> |
          <InfoText> Info 텍스트</InfoText>
        </div>
      </TypographyDemo>

      <ColorDemo>
        <SectionTitle>Color System</SectionTitle>

        <ColorSection>
          <h4
            style={{
              margin: 0,
              color: 'var(--text-text-title)',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            Text Colors
          </h4>
          <ColorRow>
            <ColorBox color="--text-text-primary" />
            <ColorLabel>Text Primary</ColorLabel>
            <ColorCode>#4561FF</ColorCode>
          </ColorRow>
          <ColorRow>
            <ColorBox color="--text-text-title" />
            <ColorLabel>Text Title</ColorLabel>
            <ColorCode>#1c1c1c</ColorCode>
          </ColorRow>
          <ColorRow>
            <ColorBox color="--text-text-secondary" />
            <ColorLabel>Text Secondary</ColorLabel>
            <ColorCode>#555555</ColorCode>
          </ColorRow>
          <ColorRow>
            <ColorBox color="--text-text-link" />
            <ColorLabel>Text Link</ColorLabel>
            <ColorCode>#0057FF</ColorCode>
          </ColorRow>
        </ColorSection>

        <ColorSection>
          <h4
            style={{
              margin: 0,
              color: 'var(--text-text-title)',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            Surface Colors
          </h4>
          <ColorRow>
            <ColorBox color="--surface-surface-default" />
            <ColorLabel>Surface Default</ColorLabel>
            <ColorCode>#FFFFFF</ColorCode>
          </ColorRow>
          <ColorRow>
            <ColorBox color="--surface-surface-highlight" />
            <ColorLabel>Surface Highlight</ColorLabel>
            <ColorCode>#F4F4F4</ColorCode>
          </ColorRow>
          <ColorRow>
            <ColorBox color="--surface-surface-highlight2" />
            <ColorLabel>Surface Highlight2</ColorLabel>
            <ColorCode>#EEEEEE</ColorCode>
          </ColorRow>
        </ColorSection>

        <ColorSection>
          <h4
            style={{
              margin: 0,
              color: 'var(--text-text-title)',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            Line Colors
          </h4>
          <ColorRow>
            <ColorBox color="--line-line-001" />
            <ColorLabel>Line001</ColorLabel>
            <ColorCode>#EEEEEE</ColorCode>
          </ColorRow>
          <ColorRow>
            <ColorBox color="--line-line-002" />
            <ColorLabel>Line002</ColorLabel>
            <ColorCode>#E0E0E0</ColorCode>
          </ColorRow>
          <ColorRow>
            <ColorBox color="--line-line-003" />
            <ColorLabel>Line003</ColorLabel>
            <ColorCode>#1C1C1C</ColorCode>
          </ColorRow>
        </ColorSection>
      </ColorDemo>

      <Button onClick={() => alert('Hello from styled button!')}>
        클릭해보세요!
      </Button>
    </Container>
  );
};

export default LoginPage;
