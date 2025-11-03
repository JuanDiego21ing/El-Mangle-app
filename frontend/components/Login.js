import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  // --- 1. Importamos los componentes necesarios ---
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; 

const logo = require("../assets/logo2.png");

const Login = ({ navigation }) => {
  // (La lógica se queda 100% igual)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Campos requeridos", "Por favor, ingresa correo y contraseña.");
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      })
      .catch((error) => {
        let errorMessage = "Correo o contraseña incorrectos.";
        Alert.alert("Error de inicio de sesión", errorMessage);
      });
  };

  // --- 2. Modificamos el JSX ---
  return (
    // 'KeyboardAvoidingView' envuelve todo
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#FFFFFF' }} // <-- Ocupa toda la pantalla y pone el fondo
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // <-- Comportamiento por OS
    >
      {/* 'ScrollView' permite que el contenido se mueva */}
      <ScrollView 
        contentContainerStyle={styles.container} // <-- El estilo original se aplica aquí
        keyboardShouldPersistTaps="handled" // <-- Permite tocar botones con el teclado abierto
      >
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// --- 3. Modificamos los Estilos ---
const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // <-- Importante: 'flexGrow' en lugar de 'flex' para ScrollView
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#FFFFFF",
  },
  // (El resto de los estilos se queda 100% igual)
  logo: {
    width: "80%",
    height: 150,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222222",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    height: 50,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 16,
    color: "#222222",
  },
  entrarBoton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
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
    color: "#555555",
  },
  registerText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default Login;