import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";

// Tus imports de Firebase (intactos)
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; 

const logo = require("../assets/logo2.png");

// Toda tu lógica (intacta)
const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Campos requeridos", "Por favor, ingresa correo y contraseña.");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigation.navigate("Home");
      })
      .catch((error) => {
        let errorMessage = "Correo o contraseña incorrectos.";
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
            errorMessage = "El correo o la contraseña son incorrectos.";
        }
        Alert.alert("Error de inicio de sesión", errorMessage);
      });
  };

  // Tu JSX (intacto)
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#888"
      />
      <TouchableOpacity
        style={styles.entrarBoton}
        onPress={handleLogin}
        activeOpacity={0.7}
      >
        <Text style={styles.entrarTexto}>Entrar</Text>
      </TouchableOpacity>

      <View style={styles.registerLinkContainer}>
        <Text style={styles.noCuenta}>¿No tienes una cuenta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerText}>Regístrate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- INICIO DE LA MODIFICACIÓN DE ESTILOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#FFFFFF", // <-- Fondo blanco
  },
  logo: {
    width: "80%",
    height: 150,
    alignSelf: "center",
    marginBottom: 20, // Reducimos un poco el margen
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222222", // <-- Título con negro suave
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    height: 50,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E0E0E0", // <-- Borde gris claro
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8, // <-- Bordes más suaves
    fontSize: 16,
    color: "#222222", // <-- Color del texto
  },
  entrarBoton: {
    backgroundColor: "#007AFF", // <-- Color primario (Azul)
    padding: 15,
    borderRadius: 8, // <-- Bordes más suaves
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
    marginTop: 25,
    alignItems: "center",
  },
  noCuenta: {
    fontSize: 16,
    color: "#555555", // <-- Gris oscuro
  },
  registerText: {
    color: "#007AFF", // <-- Color primario (Azul)
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
});
// --- FIN DE LA MODIFICACIÓN DE ESTILOS ---

export default Login;