import { useContext } from 'react';
import AuthContext from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const Logout = () => {
  const { logoutUser } = useContext(AuthContext);
  return <Button onClick={logoutUser}>Logout</Button>;
};

export default Logout;
