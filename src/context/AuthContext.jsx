import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../api/client';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem('sims_user'));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);
  const [ready, setReady] = useState(false);

  const save = (data) => {
    localStorage.setItem('sims_token', data.token);
    localStorage.setItem('sims_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = useCallback(() => {
    localStorage.removeItem('sims_token');
    localStorage.removeItem('sims_user');
    setUser(null);
  }, []);

  // Confirm the stored token still works (the account may have been locked since).
  useEffect(() => {
    if (!localStorage.getItem('sims_token')) {
      setUser(null);
      setReady(true);
      return;
    }
    api
      .get('/api/v1/users/me')
      .then((r) => setUser(r.data))
      .catch(() => logout())
      .finally(() => setReady(true));
  }, [logout]);

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    save(data);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post('/api/auth/register', payload);
    if (data.token) save(data);
    return data;
  };

  return <Ctx.Provider value={{ user, ready, login, register, logout }}>{children}</Ctx.Provider>;
}
