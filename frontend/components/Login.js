import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert, // <--- 1. Importa Alert para mostrar errores
} from "react-native";

// --- INICIO DE LA MODIFICACIÓN 1 ---
// Ya no importamos 'useAuth', importamos las funciones reales de Firebase
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // (Asegúrate que la ruta sea correcta)
// --- FIN DE LA MODIFICACIÓN 1 ---

const logo = require("../assets/logo2.png");

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // --- INICIO DE LA MODIFICACIÓN 2 ---
  // const { mockLogin } = useAuth(); // <-- Borramos la función simulada

  const handleLogin = () => {
    // 1. La validación se queda igual
    if (!email || !password) {
      Alert.alert("Campos requeridos", "Por favor, ingresa correo y contraseña.");
      return;
    }

    // 2. Llamamos a la función REAL de Firebase
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Inicio de sesión exitoso.
        // AuthContext se actualizará solo.
        // 3. Navegamos al Home DESPUÉS de que el login sea exitoso.
        navigation.navigate("Home");
      })
      .catch((error) => {
        // 4. Manejamos los errores de Firebase
        let errorMessage = "Correo o contraseña incorrectos.";
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
            errorMessage = "El correo o la contraseña son incorrectos.";
        }
        Alert.alert("Error de inicio de sesión", errorMessage);
      });
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
        onPress={handleLogin} // 'handleLogin' ahora llama a la función real
        activeOpacity={0.7}
      >
        <Text style={styles.entrarTexto}>Entrar</Text>
      </TouchableOpacity>

      {/* Tu link de registro se queda igual */}
      <View style={styles.registerLinkContainer}>
        <Text style={styles.noCuenta}>No tienes una cuenta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerText}>Registrarse</Text>
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
  registerText: {
    color: "#007bff",
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default Login;