import React from "react";
import { Image, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider } from "./components/AuthContext";

// Importa las pantallas
import HomeScreen from "./components/HomeScreen";
import BusinessDetailScreen from "./components/BusinessDetailScreen";
import Login from "./components/Login";
import Register from "./components/Register";
// --- 1. AÑADIMOS LA PANTALLA QUE FALTABA ---
// (Asegúrate que la ruta sea correcta, antes la pusimos en 'screens/')
import CreateBusinessScreen from "./components/CreateBusinessScreen"; 
import AddProductScreen from "./components/AddProductScreen";
import EditProductScreen from "./components/EditProductScreen";
import EditBusinessScreen from "./components/EditBusinessScreen";

// --- CONFIGURACIÓN DE NAVEGACIÓN ---
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // --- 2. AuthProvider DEBE ENVOLVER TODO ---
    <AuthProvider>
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
              // --- NOTA ---
              // Este botón de "Login" en la cabecera ya no es necesario
              // porque tu HomeScreen ahora muestra "Iniciar Sesión"
              // o "Registrar Negocio" en el contenido.
              // Puedes borrar todo el 'headerRight' si quieres.
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

          {/* --- 3. AÑADIMOS LA PANTALLA A LA NAVEGACIÓN --- */}
          <Stack.Screen
            name="CreateBusiness"
            component={CreateBusinessScreen}
            options={{ title: "Registrar Negocio" }}
          />

          <Stack.Screen
            name="AddProduct"
            component={AddProductScreen}
            options={{ title: "Añadir Producto" }}
          />

          <Stack.Screen
            name="EditProduct"
            component={EditProductScreen}
            options={{ title: "Editar Producto" }}
          />

          <Stack.Screen
            name="EditBusiness"
            component={EditBusinessScreen}
            options={{ title: "Editar Negocio" }}
          />

          {/* --- 4. ELIMINAMOS ESTAS LÍNEAS QUE CAUSAN EL ERROR ---
          <AuthProvider>
            <MainNavigator />
          </AuthProvider>
          */}

        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider> // --- 2. AuthProvider CIERRA AQUÍ ---
  );
}