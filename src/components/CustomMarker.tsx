interface CourseMarkerIconProps {
  label: string;
  isSelected: boolean;
  width?: number;
  height?: number;
  fontSize?: number;
}

const CourseMarkerIcon = ({ label, isSelected, width = 26, height = 32, fontSize = 14 }: CourseMarkerIconProps) => {
  const fillColor = isSelected ? '#4561FF' : 'white';
  const strokeColor = isSelected ? '#1B37D3' : '#4561FF';
  const textColor = isSelected ? 'white' : '#4561FF';

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 26 32" fill="none">
      <path
        d="M12.9521 0.5C19.8377 0.5 25.4042 6.0096 25.4043 12.7998C25.4043 17.4001 22.2837 22.0783 19.0566 25.666C17.4554 27.4462 15.8526 28.9313 14.6494 29.9717C14.0484 30.4914 13.5476 30.8993 13.1982 31.1768C13.1058 31.2502 13.0225 31.3134 12.9521 31.3682C12.8819 31.3135 12.7994 31.2501 12.707 31.1768C12.3577 30.8993 11.857 30.4915 11.2559 29.9717C10.0526 28.9312 8.44906 27.4464 6.84766 25.666C3.6206 22.0783 0.5 17.4001 0.5 12.7998C0.500107 6.00967 6.06668 0.500124 12.9521 0.5Z"
        fill={fillColor}
        stroke={strokeColor}
      />
      <text
        x="13"
        y="15"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={textColor}
        fontSize={fontSize}
        fontWeight="600"
        fontFamily="Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif"
      >
        {label}
      </text>
    </svg>
  );
};

export default CourseMarkerIcon;
