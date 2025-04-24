import { useNavigate } from 'react-router-dom';

const Logo = ({
  color,
  flex,
  text,
  gap,
}: {
  color?: string;
  flex?: string;
  text: string;
  gap?: number;
}) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate('/')}
      className={`flex flex-${flex} items-center justify-center hover:border hover:border-orange-500 w-fit px-2 py-1 cursor-pointer gap-${gap} text-${color}`}
    >
      <span
        className={`text-${color} font-extrabold text-${text} tracking-wide`}
      >
        TECH
      </span>
      <span
        className={`text-${color} font-extrabold text-${text} tracking-wide`}
      >
        COMMERCE
      </span>
    </div>
  );
};

export default Logo;
