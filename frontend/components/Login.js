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
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; 

const logo = require("../assets/logo2.png");

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
        // --- INICIO DE LA MODIFICACIÓN ---
        // Ya no navegamos. Reseteamos el historial para que 'Home'
        // sea la única pantalla y no haya "atrás".
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
        // --- FIN DE LA MODIFICACIÓN ---
      })
      .catch((error) => {
        let errorMessage = "Correo o contraseña incorrectos.";
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
            errorMessage = "El correo o la contraseña son incorrectos.";
        }
        Alert.alert("Error de inicio de sesión", errorMessage);
      });
  };

  // (El resto de tu JSX y estilos se quedan 100% igual)
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

// (Tus estilos se quedan 100% igual)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#FFFFFF",
  },
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