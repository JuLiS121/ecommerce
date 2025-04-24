import Navbar from '@/components/shared/Navbar';
import MobileNav from '@/components/shared/MobileNav';
import { Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <div className="w-full h-full">
      <MobileNav />
      <Navbar />
      <Outlet />
    </div>
  );
};

export default RootLayout;
