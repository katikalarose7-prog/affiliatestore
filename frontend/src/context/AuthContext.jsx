import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
  const [adminUser, setAdminUser] = useState(() => localStorage.getItem('admin_user'));

  const login = (tkn, username) => {
    setToken(tkn);
    setAdminUser(username);
    localStorage.setItem('admin_token', tkn);
    localStorage.setItem('admin_user', username);
  };

  const logout = () => {
    setToken(null);
    setAdminUser(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  };

  return (
    <AuthContext.Provider value={{ token, adminUser, login, logout, isAdmin: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);