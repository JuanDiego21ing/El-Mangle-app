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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; 

const logo = require("../assets/icon.png");

const Register = ({ navigation }) => {
  // (La lógica se queda 100% igual)
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
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      })
      .catch((error) => {
        let errorMessage = "Ocurrió un error al registrarte.";
        Alert.alert("Error de Registro", errorMessage);
      });
  };

  // --- 2. Modificamos el JSX ---
  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// --- 3. Modificamos los Estilos ---
const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // <-- 'flexGrow' en lugar de 'flex'
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

export default Register;