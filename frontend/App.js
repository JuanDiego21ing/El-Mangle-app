import React from "react";
import { Image, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Importa las pantallas desde la carpeta de componentes
import HomeScreen from "./components/HomeScreen";
import BusinessDetailScreen from "./components/BusinessDetailScreen";
import Login from "./components/Login";
import Register from "./components/Register"; // <-- 1. Importa Register

// --- CONFIGURACIÓN DE NAVEGACIÓN ---
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#FFFFFF",
          },
          headerTintColor: "#333",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <Image
                source={require("./assets/logo2.png")}
                style={{ width: 120, height: 40, resizeMode: "contain" }}
              />
            ),
            headerRight: () => (
              <Button
                onPress={() => navigation.navigate("Login")}
                title="Login"
                color="#007bff"
              />
            ),
          })}
        />
        <Stack.Screen
          name="BusinessDetail"
          component={BusinessDetailScreen}
          options={({ route }) => ({ title: route.params.businessName })}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: "Iniciar sesión" }}
        />

        <Stack.Screen
          name="Register"
          component={Register}
          options={{ title: "Crear cuenta" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
