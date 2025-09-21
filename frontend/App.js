import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
 
  const [mensaje, setMensaje] = useState('Cargando...');


  useEffect(() => {
   
    const ipAddress = 'http://10.218.231.246:3000'; 
    
    fetch(ipAddress)
      .then(response => {
        
        if (!response.ok) {
          throw new Error('La respuesta de la red no fue exitosa');
        }
        return response.text();
      })
      .then(data => {
        
        setMensaje(data);
      })
      .catch(error => {
       
        console.error('Error al conectar:', error);
        setMensaje('Error: No se pudo conectar con el servidor.');
      });
  }, []); 

 
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{mensaje}</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});