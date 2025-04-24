import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { JwtPayload as BaseJwtPayload, jwtDecode } from 'jwt-decode';
import React, { createContext, useState, useEffect, useCallback } from 'react';

const domain = import.meta.env.VITE_DOMAIN;

export interface UserData {
  email: string;
  username: string;
  user_id: number;
  is_admin: boolean;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

interface MyJwtPayload extends BaseJwtPayload {
  email: string;
  username: string;
  user_id: number;
  is_admin: boolean;
}

export interface ContextData {
  user: UserData | null;
  authTokens: AuthTokens | null;
  registerUser: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => void;
  getUser: (id: number) => Promise<boolean>;
}

const AuthContext = createContext<ContextData>({
  user: null,
  authTokens: null,
  registerUser: async () => {},
  loginUser: async () => {},
  logoutUser: () => {},
  getUser: async () => false,
});

export default AuthContext;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { toast } = useToast();
  const authToken = localStorage.getItem('authTokens')
    ? JSON.parse(localStorage.getItem('authTokens')!)
    : null;
  const decodedToken = authToken
    ? (jwtDecode(authToken.access) as MyJwtPayload)
    : null;
  const userData: UserData | null = decodedToken
    ? {
        user_id: decodedToken.user_id,
        email: decodedToken.email,
        username: decodedToken.username,
        is_admin: decodedToken.is_admin,
      }
    : null;
  const [user, setUser] = useState(userData);
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(authToken);
  const navigate = useNavigate();

  const registerUser = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await fetch(`${domain}create-user/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      if (response.ok) {
        toast({
          variant: 'success',
          description: 'User created successfully',
        });
        navigate('/login');
      } else {
        toast({
          variant: 'destructive',
          description: 'User with these credentials already exists',
        });
        return;
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Upps, something went wrong',
      });
      return;
    }
  };

  const getUser = useCallback(
    async (userId: number) => {
      try {
        const response = await fetch(`${domain}users/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          return data.is_admin;
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          description: 'Upps, something went wrong',
        });
        return;
      }
    },
    [toast]
  );

  const loginUser = async (email: string, password: string) => {
    try {
      const response = await fetch(`${domain}token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();
      if (response.status === 200) {
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem('authTokens', JSON.stringify(data));
        toast({
          variant: 'success',
          description: 'Welcome back',
        });
        navigate('/');
      } else {
        toast({
          variant: 'destructive',
          description: "User doesen't exists",
        });
        return;
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Upps, something went wrong',
      });
      return;
    }
  };

  const logoutUser = useCallback(() => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    navigate('/login');
  }, [navigate]);

  const updateToken = useCallback(async () => {
    try {
      const response = await fetch(`${domain}token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: authTokens!.refresh,
        }),
      });
      const data = await response.json();
      if (response.status === 200) {
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem('authTokens', JSON.stringify(data));
      } else {
        logoutUser();
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Upps, something went wrong',
      });
      return;
    }
  }, [authTokens, logoutUser, toast]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (authTokens) updateToken();
    }, 1000 * 60 * 4);
    return () => clearInterval(interval);
  }, [authTokens, updateToken]);

  const contextData = {
    user,
    authTokens,
    registerUser,
    loginUser,
    logoutUser,
    getUser,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
