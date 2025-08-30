interface CircleMarkerProps {
  number: number;
  isDestination?: boolean;
  size?: number;
}

const CircleMarker = ({ number, isDestination = false, size = 22 }: CircleMarkerProps) => {
  const backgroundColor = isDestination ? '#FF5656' : 'white';
  const borderColor = isDestination ? '#D70000' : '#1B37D3';
  const textColor = isDestination ? 'white' : '#4561FF';

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="10" fill={backgroundColor} stroke={borderColor} strokeWidth="1" />
      <text
        x="11"
        y="11.5"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={textColor}
        fontSize="11"
        fontWeight="600"
        fontFamily="Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif"
      >
        {number}
      </text>
    </svg>
  );
};

export default CircleMarker;
