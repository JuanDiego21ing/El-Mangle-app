import React from 'react';

// Importaciones de React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importa las pantallas desde la carpeta de componentes
import HomeScreen from './components/HomeScreen';
import BusinessDetailScreen from './components/BusinessDetailScreen';

// --- CONFIGURACIÓN DE NAVEGACIÓN ---
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#333',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Directorio de Negocios' }} 
        />
        <Stack.Screen 
          name="BusinessDetail" 
          component={BusinessDetailScreen} 
          options={({ route }) => ({ title: route.params.businessName })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}