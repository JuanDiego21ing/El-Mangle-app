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

const logo = require("../assets/logo2.png");

const Register = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    console.log("Intento de registro con:", name, email, password);
    Alert.alert("Registro exitoso", `Bienvenido, ${name}!`);
  };

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
      <TextInput
        style={styles.input}
        placeholder="Repetir contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
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
