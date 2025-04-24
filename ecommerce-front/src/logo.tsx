import { useNavigate } from 'react-router-dom';

const Logo = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate('/')}
      className="flex flex-col items-center justify-center w-fit px-2 py-1"
    >
      <span className="font-bold text-2xl text-red-500 tracking-wide">
        ROYAL TECHNOLOGY
      </span>
      <span className="text-md text-red-500 tracking-wider">SHOP</span>
    </div>
  );
};
export default Logo;
