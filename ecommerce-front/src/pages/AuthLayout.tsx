import { Outlet, Navigate } from 'react-router-dom';
import Logo from '../components/shared/Logo';
import { useContext } from 'react';
import AuthContext from '@/context/AuthContext';

const AuthLayout = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="flex flex-col items-center justify-between mx-auto my-10">
      {!user ? (
        <>
          <Logo text="2xl" gap={2} />
          <Outlet />
        </>
      ) : (
        <Navigate to="/" />
      )}
    </div>
  );
};

export default AuthLayout;
