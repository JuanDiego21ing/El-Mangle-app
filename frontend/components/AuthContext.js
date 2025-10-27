import React, { createContext, useState, useEffect, useContext } from 'react';
// Importamos el auth REAL desde el archivo que acabas de crear
import { auth } from '../firebaseConfig'; 
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Este es el "oyente" REAL de Firebase.
    // Se dispara solo cuando alguien inicia o cierra sesión.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // 'null' si no hay sesión, o el objeto 'user'
      setLoading(false);
    });

    return () => unsubscribe(); // Limpiar el oyente
  }, []);

  // Ya no necesitamos 'mockLogin' ni 'mockLogout'
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};