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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; 

const logo = require("../assets/logo2.png");

const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }
    if (!email || !password) {
        Alert.alert("Campos requeridos", "Por favor, ingresa correo y contraseña.");
        return;
    }
    
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // --- INICIO DE LA MODIFICACIÓN ---
        // Reseteamos el historial para que 'Home'
        // sea la única pantalla y no haya "atrás".
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
        // --- FIN DE LA MODIFICACIÓN ---
      })
      .catch((error) => {
        let errorMessage = "Ocurrió un error al registrarte.";
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = "Este correo electrónico ya está en uso.";
        } else if (error.code === 'auth/weak-password') {
          errorMessage = "La contraseña es muy débil (debe tener al menos 6 caracteres).";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "El formato del correo electrónico no es válido."
        }
        Alert.alert("Error de Registro", errorMessage);
      });
  };

  // (El resto de tu JSX y estilos se quedan 100% igual)
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Crear Cuenta</Text>
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
        placeholder="Contraseña (mín. 6 caracteres)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Repetir contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholderTextColor="#888"
      />
      <TouchableOpacity
        style={styles.entrarBoton}
        onPress={handleRegister}
        activeOpacity={0.7}
      >
        <Text style={styles.entrarTexto}>Registrarse</Text>
      </TouchableOpacity>
      <View style={styles.registerLinkContainer}>
        <Text style={styles.noCuenta}>¿Ya tienes una cuenta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.registerText}>Inicia sesión</Text>
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

export default Register;