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
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "./AuthContext";

// (La lógica y los arrays se quedan 100% igual)
const CATEGORIES_LIST = [
  "Restaurante", "Cafetería", "Servicios", "Compras", "Salud", "Belleza", "Otro",
];

const INITIAL_FORM_STATE = {
  nombre: "", category: "", descripcion: "", telefono: "", email: "",
  horario: "", estado: "Operando", mainImageUrl: "", address: "",
};

export default function CreateBusinessScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleCreateBusiness = async () => {
    if (!user) {
      Alert.alert("Error", "Debes iniciar sesión para registrar un negocio.");
      return;
    }
    if (!formData.nombre || !formData.telefono || !formData.address || !formData.category) {
      Alert.alert("Campos requeridos", "Por favor, completa nombre, categoría, teléfono y ubicación.");
      return;
    }
    setLoading(true);
    try {
      const businessData = {
        ...formData,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
        products: [],
      };
      await addDoc(collection(db, "businesses"), businessData);
      setLoading(false);
      Alert.alert("¡Éxito!", "Tu negocio se ha registrado correctamente.");
      setFormData(INITIAL_FORM_STATE);
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      console.error("Error al crear negocio: ", error);
      Alert.alert("Error", "Hubo un problema al registrar tu negocio.");
    }
  };

  // (El JSX/return se queda 100% igual, solo añadimos 'placeholderTextColor')
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
            placeholderTextColor="#888"
            value={formData.nombre}
            onChangeText={(text) => handleChange("nombre", text)}
          />

          <Text style={styles.label}>Categoría *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.category}
              onValueChange={(itemValue) => handleChange("category", itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecciona una categoría..." value="" />
              {CATEGORIES_LIST.map((cat) => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>
          </View>
          
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="Una breve descripción de tu negocio..."
            placeholderTextColor="#888"
            value={formData.descripcion}
            onChangeText={(text) => handleChange("descripcion", text)}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Teléfono *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 612 123 4567"
            placeholderTextColor="#888"
            value={formData.telefono}
            onChangeText={(text) => handleChange("telefono", text)}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: contacto@minegocio.com"
            placeholderTextColor="#888"
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Horario</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Lunes a Viernes de 9am - 6pm"
            placeholderTextColor="#888"
            value={formData.horario}
            onChangeText={(text) => handleChange("horario", text)}
          />
          
          <Text style={styles.label}>Ubicación / Dirección *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Av. Insurgentes Sur 123"
            placeholderTextColor="#888"
            value={formData.address}
            onChangeText={(text) => handleChange("address", text)}
          />
          
          <Text style={styles.label}>Logo (URL)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://ejemplo.com/mi-logo.png"
            placeholderTextColor="#888"
            value={formData.mainImageUrl}
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

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleCreateBusiness}
            disabled={loading}
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

// --- INICIO DE LA MODIFICACIÓN DE ESTILOS ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF", // <-- Fondo blanco
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222222", // <-- Negro suave
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555555", // <-- Gris oscuro
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
    color: "#222222", // <-- Negro suave
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8, // <-- Bordes suaves
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0", // <-- Borde gris claro
    color: "#222222",
  },
  inputMultiline: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 8, // <-- Bordes suaves
    borderWidth: 1,
    borderColor: "#E0E0E0", // <-- Borde gris claro
    marginBottom: 20,
    justifyContent: 'center',
  },
  picker: {
    width: "100%",
    height: 50,
    color: "#222222",
  },
  submitButton: {
    backgroundColor: "#007AFF", // <-- Color primario (Azul)
    paddingVertical: 15,
    borderRadius: 8, // <-- Bordes suaves
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
// --- FIN DE LA MODIFICACIÓN DE ESTILOS ---