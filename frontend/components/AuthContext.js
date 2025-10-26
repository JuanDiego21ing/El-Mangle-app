// components/AuthContext.js

import React, { createContext, useState, useContext } from 'react';
// ¡Ya no importamos nada de Firebase!

// 1. Crear el Contexto
const AuthContext = createContext();

// 2. Crear el Proveedor (Provider)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Por defecto, no hay usuario (null)
  const [loading, setLoading] = useState(false); // No estamos esperando a Firebase, así que false

  // --- FUNCIONES SIMULADAS ---

  // Llama a esta función desde tu LoginScreen cuando el login sea "exitoso"
  const mockLogin = () => {
    console.log("Simulando inicio de sesión...");
    // Creamos un objeto de usuario falso. 
    // Lo importante es que 'user' ya no sea 'null'.
    setUser({ 
      uid: 'usuario-falso-123', 
      email: 'prueba@test.com',
    });
  };

  // Llama a esta función desde un botón de "Cerrar Sesión"
  const mockLogout = () => {
    console.log("Simulando cierre de sesión...");
    setUser(null);
  };

  // Pasamos el 'user' y las funciones para simular
  return (
    <AuthContext.Provider value={{ user, loading, mockLogin, mockLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Crear un "Hook" personalizado para usar el contexto
export const useAuth = () => {
  return useContext(AuthContext);
};