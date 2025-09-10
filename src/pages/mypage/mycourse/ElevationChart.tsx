import { useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import type { TrackPoint } from '@/types/create';

// Chart.js 컴포넌트 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

interface ElevationChartProps {
  trackPoints: TrackPoint[];
}

const ElevationChart = ({ trackPoints }: ElevationChartProps) => {
  const [t] = useTranslation();
  const chartRef = useRef(null);

  console.log('ElevationChart trackPoints:', trackPoints);

  // trackPoints에서 고도 데이터 추출 및 거리 계산
  const processElevationData = (points: TrackPoint[]) => {
    if (!points || points.length === 0) return { labels: [], elevations: [] };

    const labels: string[] = [];
    const elevations: number[] = [];
    let totalDistance = 0;

    points.forEach((point, index) => {
      if (index === 0) {
        labels.push('0');
        elevations.push(point.ele);
        return;
      }

      // 이전 포인트와의 거리 계산 (하버사인 공식)
      const prevPoint = points[index - 1];
      const distance = calculateDistance(prevPoint.lat, prevPoint.lon, point.lat, point.lon);

      totalDistance += distance;
      labels.push(totalDistance.toFixed(1));
      elevations.push(point.ele);
    });

    return { labels, elevations };
  };

  // 두 지점 간 거리 계산 (하버사인 공식)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // 지구 반지름 (km)
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const { labels, elevations } = processElevationData(trackPoints);

  const data = {
    labels,
    datasets: [
      {
        data: elevations,
        borderColor: '#4261FF',
        backgroundColor: (context: { chart: { ctx: CanvasRenderingContext2D } }) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, 'rgba(66, 97, 255, 0.5)');
          gradient.addColorStop(1, 'rgba(66, 97, 255, 0.05)');
          return gradient;
        },
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: '#4261FF',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
        fill: true,
        tension: 0.1,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(28, 28, 28, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#4261FF',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context: Array<{ label: string }>) => `거리: ${context[0].label}km`,
          label: (context: { parsed: { y: number } }) => `고도: ${context.parsed.y}m`,
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: false,
        },
        grid: {
          display: true,
          color: '#F0F0F0',
        },
        ticks: {
          color: '#666666',
          font: {
            size: 11,
          },
          maxTicksLimit: 6,
          callback: function (value: string | number) {
            return value + 'km';
          },
        },
      },
      y: {
        display: true,
        title: {
          display: false,
        },
        grid: {
          display: true,
          color: '#F0F0F0',
        },
        ticks: {
          color: '#666666',
          font: {
            size: 11,
          },
          maxTicksLimit: window.innerWidth <= 600 ? 6 : 10,
          callback: function (value: string | number) {
            return value + 'm';
          },
        },
      },
    },
  };

  if (!trackPoints || trackPoints.length === 0) {
    return (
      <EmptyState>
        <EmptyText>{t('mypage.myCourseDetail.elevationChart.error')}</EmptyText>
      </EmptyState>
    );
  }

  return (
    <ChartContainer>
      <Line ref={chartRef} data={data} options={options} />
    </ChartContainer>
  );
};

export default ElevationChart;

const ChartContainer = styled.div`
  width: 100%;
  height: 280px;

  @media (max-width: 600px) {
    height: 200px;
  }
`;

const EmptyState = styled.div`
  width: 100%;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 600px) {
    height: 200px;
  }
`;

const EmptyText = styled.div`
  ${theme.typography.body2}
  color: var(--text-text-secondary, #555555);
`;
