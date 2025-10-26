import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

// --- INICIO DE LA MODIFICACIÓN 1 ---
import { useAuth } from "./AuthContext"; // Asegúrate que la ruta sea correcta
// --- FIN DE LA MODIFICACIÓN 1 ---

const logo = require("../assets/logo2.png");

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // --- INICIO DE LA MODIFICACIÓN 2 ---
  const { mockLogin } = useAuth(); // Obtenemos la función simulada

  const handleLogin = () => {
    // console.log("Intento de login con:", email, password);
    // alert(`Login con email: ${email}`);
    
    // 1. (Opcional) Aquí puedes validar que email y password no estén vacíos
    if (!email || !password) {
      alert("Por favor, ingresa correo y contraseña.");
      return;
    }

    // 2. Llamamos a la función de login simulado del contexto
    mockLogin();

    // 3. Navegamos al Home. El HomeScreen ya sabrá que estás logueado.
    navigation.navigate("Home"); 
  };
  // --- FIN DE LA MODIFICACIÓN 2 ---

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.entrarBoton}
        onPress={handleLogin} // 'handleLogin' ahora está actualizado
        activeOpacity={0.7}
      >
        <Text style={styles.entrarTexto}>Entrar</Text>
      </TouchableOpacity>

      {/* Actualización: Contenedor para el texto de registro */}
      <View style={styles.registerLinkContainer}>
        <Text style={styles.noCuenta}>No tienes una cuenta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerText}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
    paddingBottom: 100,
    backgroundColor: "#faebd7",
  },

  logo: {
    width: "80%",
    height: 150,
    alignSelf: "center",
    marginBottom: 30,
  },

  input: {
    height: 50,
    borderColor: "#000000ff",
    backgroundColor: "white",
    borderWidth: 2,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 15,
  },

  entrarBoton: {
    backgroundColor: "#2ca909ff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },

  entrarTexto: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  registerLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    alignItems: "center",
  },
  noCuenta: {
    fontSize: 16,
  },
  registerText: {
    color: "#007bff",
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default Login;