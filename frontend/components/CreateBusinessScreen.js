import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
//import { collection, addDoc, serverTimestamp } from "firebase/firestore";
//import { db } from "../firebaseConfig"; // Asegúrate que la ruta a tu config de Firebase sea correcta
import { useAuth } from "./AuthContext"; // Importamos el hook de autenticación

// Nombres de los campos que SÍ van en el formulario
const INITIAL_FORM_STATE = {
  nombre: "",
  descripcion: "",
  telefono: "",
  email: "",
  horario: "",
  estado: "Operando", // Valor por defecto
  mainImageUrl: "", // Coincide con tu HomeScreen (Logo por URL)
  address: "", // Coincide con tu HomeScreen (Ubicación)
  // NOTA: 'category' también está en tu HomeScreen. 
  // Podrías añadir un Picker para 'category' aquí también.
  // Por ahora, lo omitimos para seguir tu solicitud.
};

export default function CreateBusinessScreen() {
  const { user } = useAuth(); // Obtenemos el usuario logueado
  const navigation = useNavigation();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);

  // Un solo manejador para todos los inputs
  const handleChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleCreateBusiness = async () => {
    // 1. Validación (esto se queda igual)
    if (!user) {
      Alert.alert("Error", "Debes iniciar sesión para registrar un negocio.");
      return;
    }
    if (!formData.nombre || !formData.telefono || !formData.address) {
      Alert.alert("Campos requeridos", "Por favor, completa nombre, teléfono y ubicación.");
      return;
    }

    setLoading(true);

    // --- INICIO DE LA SIMULACIÓN ---
    try {
      // Preparamos los datos como si fueran para Firebase
      const businessData = {
        ...formData,
        ownerId: user.uid, // ¡El ID del usuario simulado!
        createdAt: new Date().toISOString(), // Fecha de creación simulada
      };

      console.log("--- SIMULANDO GUARDADO DE NEGOCIO ---");
      console.log(businessData);
      console.log("--------------------------------------");
      
      // Simulamos un pequeño retraso (como si estuviera guardando en la red)
      setTimeout(() => {
        setLoading(false);
        Alert.alert("¡Éxito! (Simulado)", "Tu negocio se ha registrado correctamente.");
        
        // Reseteamos el formulario y volvemos atrás
        setFormData(INITIAL_FORM_STATE);
        navigation.goBack();
      }, 1500); // 1.5 segundos de espera

    } catch (error) {
      setLoading(false);
      console.error("Error simulado: ", error);
      Alert.alert("Error", "Hubo un problema al registrar tu negocio.");
    }
    // --- FIN DE LA SIMULACIÓN ---
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Registra tu Negocio</Text>
        <Text style={styles.subtitle}>Completa los datos para aparecer en el directorio.</Text>
        
        <View style={styles.form}>
          
          <Text style={styles.label}>Nombre del Negocio *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Taquería El Super Burro"
            value={formData.nombre}
            onChangeText={(text) => handleChange("nombre", text)}
          />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="Una breve descripción de tu negocio..."
            value={formData.descripcion}
            onChangeText={(text) => handleChange("descripcion", text)}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Teléfono *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 612 123 4567"
            value={formData.telefono}
            onChangeText={(text) => handleChange("telefono", text)}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: contacto@minegocio.com"
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Horario</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Lunes a Viernes de 9am - 6pm"
            value={formData.horario}
            onChangeText={(text) => handleChange("horario", text)}
          />
          
          <Text style={styles.label}>Ubicación / Dirección *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Av. Insurgentes Sur 123"
            value={formData.address} // Guardamos como 'address' para coincidir con tu HomeScreen
            onChangeText={(text) => handleChange("address", text)}
          />
          
          <Text style={styles.label}>Logo (URL)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://ejemplo.com/mi-logo.png"
            value={formData.mainImageUrl} // Guardamos como 'mainImageUrl' para coincidir con tu HomeScreen
            onChangeText={(text) => handleChange("mainImageUrl", text)}
            keyboardType="url"
            autoCapitalize="none"
          />
          
          <Text style={styles.label}>Estado del Negocio</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.estado}
              onValueChange={(itemValue) => handleChange("estado", itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Operando" value="Operando" />
              <Picker.Item label="Inactivo / Cerrado Temporalmente" value="Inactivo" />
            </Picker>
          </View>

          {/* Botón de envío */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleCreateBusiness}
            disabled={loading} // Se deshabilita mientras carga
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Registrar Negocio</Text>
            )}
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#faebd7", // Color de fondo de tu HomeScreen
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  form: {
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  inputMultiline: {
    height: 100,
    textAlignVertical: "top", // Para que el texto empiece arriba en Android
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    marginBottom: 20,
    justifyContent: 'center',
  },
  picker: {
    width: "100%",
    height: 50, // Ajustar altura si es necesario
  },
  submitButton: {
    backgroundColor: "#e9967a", // Color principal de tu HomeScreen
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});