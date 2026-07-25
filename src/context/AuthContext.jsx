import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('tomato_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback((userData) => {
    // userData = { token, userId, name, email }
    localStorage.setItem('tomato_token', userData.token);
    localStorage.setItem('tomato_user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('tomato_token');
    localStorage.removeItem('tomato_user');
    setUser(null);
  }, []);

  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
    };
    window.addEventListener('tomato_logout', handleLogout);
    return () => window.removeEventListener('tomato_logout', handleLogout);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
