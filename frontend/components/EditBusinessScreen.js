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
// --- 1. Imports de Firebase para ACTUALIZAR ---
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Lista de categorías
const CATEGORIES_LIST = [
  "Restaurante", "Cafetería", "Servicios", "Compras", "Salud", "Belleza", "Otro",
];

// --- 2. Recibimos 'route' para obtener los datos ---
export default function EditBusinessScreen({ route, navigation }) {
  // Obtenemos los datos del negocio que pasamos desde la pantalla de detalle
  const { businessData } = route.params;

  // --- 3. El estado inicial se RELLENA con los datos del negocio ---
  const [formData, setFormData] = useState({
    nombre: businessData.nombre,
    category: businessData.category,
    descripcion: businessData.descripcion,
    telefono: businessData.telefono,
    email: businessData.email,
    horario: businessData.horario,
    estado: businessData.estado,
    mainImageUrl: businessData.mainImageUrl,
    address: businessData.address,
    // No traemos 'ownerId', 'createdAt', o 'products', 
    // porque solo queremos editar estos campos.
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  // --- 4. Nueva función para ACTUALIZAR el negocio ---
  const handleUpdateBusiness = async () => {
    // Validación (igual que antes)
    if (!formData.nombre || !formData.telefono || !formData.address || !formData.category) {
      Alert.alert("Campos requeridos", "Por favor, completa nombre, categoría, teléfono y ubicación.");
      return;
    }

    setLoading(true);

    try {
      // Apunta al documento del negocio por su ID
      const businessRef = doc(db, "businesses", businessData.id);

      // Actualiza el documento con los datos del formulario
      await updateDoc(businessRef, formData);

      setLoading(false);
      Alert.alert("¡Éxito!", "Tu negocio se ha actualizado.");
      navigation.goBack(); // Vuelve a la pantalla de detalle

    } catch (error) {
      setLoading(false);
      console.error("Error al actualizar negocio: ", error);
      Alert.alert("Error", "Hubo un problema al actualizar tu negocio.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* --- 5. Título y botón actualizados --- */}
        <Text style={styles.title}>Editar Negocio</Text>
        
        <View style={styles.form}>
          
          <Text style={styles.label}>Nombre del Negocio *</Text>
          <TextInput
            style={styles.input}
            value={formData.nombre} // 'value' carga el dato
            onChangeText={(text) => handleChange("nombre", text)}
          />

          <Text style={styles.label}>Categoría *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.category} // 'selectedValue' carga el dato
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
            value={formData.descripcion} // 'value' carga el dato
            onChangeText={(text) => handleChange("descripcion", text)}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Teléfono *</Text>
          <TextInput
            style={styles.input}
            value={formData.telefono} // 'value' carga el dato
            onChangeText={(text) => handleChange("telefono", text)}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email} // 'value' carga el dato
            onChangeText={(text) => handleChange("email", text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Horario</Text>
          <TextInput
            style={styles.input}
            value={formData.horario} // 'value' carga el dato
            onChangeText={(text) => handleChange("horario", text)}
          />
          
          <Text style={styles.label}>Ubicación / Dirección *</Text>
          <TextInput
            style={styles.input}
            value={formData.address} // 'value' carga el dato
            onChangeText={(text) => handleChange("address", text)}
          />
          
          <Text style={styles.label}>Logo (URL)</Text>
          <TextInput
            style={styles.input}
            value={formData.mainImageUrl} // 'value' carga el dato
            onChangeText={(text) => handleChange("mainImageUrl", text)}
            keyboardType="url"
            autoCapitalize="none"
          />
          
          <Text style={styles.label}>Estado del Negocio</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.estado} // 'selectedValue' carga el dato
              onValueChange={(itemValue) => handleChange("estado", itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Operando" value="Operando" />
              <Picker.Item label="Inactivo / Cerrado Temporalmente" value="Inactivo" />
            </Picker>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleUpdateBusiness} // Llama a la función de actualizar
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Guardar Cambios</Text>
            )}
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// (Los estilos son idénticos a los de CreateBusinessScreen)
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#faebd7",
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
    textAlignVertical: "top",
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
    height: 50,
  },
  submitButton: {
    backgroundColor: "#e9967a",
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