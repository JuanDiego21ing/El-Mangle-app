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

// --- INICIO DE LA MODIFICACIÓN 1: Imports de Firebase ---
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // (Asegúrate que la ruta sea correcta)
// --- FIN DE LA MODIFICACIÓN 1 ---

const logo = require("../assets/logo2.png");

const Register = ({ navigation }) => {
  // const [name, setName] = useState(""); // <-- Eliminamos 'name' state, no hay input para él
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // --- INICIO DE LA MODIFICACIÓN 2: Lógica de Registro Real ---
  const handleRegister = () => {
    // Validación 1: Contraseñas coinciden (esto se queda igual)
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    // Validación 2: Campos no vacíos
    if (!email || !password) {
        Alert.alert("Campos requeridos", "Por favor, ingresa correo y contraseña.");
        return;
    }

    // console.log("Intento de registro con:", name, email, password); // <-- Eliminado
    // Alert.alert("Registro exitoso", `Bienvenido, ${name}!`); // <-- Eliminado

    // Función REAL de Firebase
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Registro exitoso. AuthContext lo detectará automáticamente.
        // Navegamos al Home
        navigation.navigate("Home");
      })
      .catch((error) => {
        // Manejo de errores de Firebase
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
  // --- FIN DE LA MODIFICACIÓN 2 ---

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />

      {/* El formulario está perfecto, no se toca */}
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
      <TextInput
        style={styles.input}
        placeholder="Repetir contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.entrarBoton}
        onPress={handleRegister} // Llama a la nueva función real
        activeOpacity={0.7}
      >
        <Text style={styles.entrarTexto}>Registrarse</Text>
      </TouchableOpacity>

      <View style={styles.registerLinkContainer}>
        <Text style={styles.noCuenta}>¿Ya tienes una cuenta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text
            style={{ ...styles.noCuenta, fontWeight: "bold", color: "#007bff" }}
          >
            Inicia sesión
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// (Tus estilos se quedan 100% idénticos)
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
});

export default Register;