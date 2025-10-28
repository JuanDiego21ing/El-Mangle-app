import React, { useState } from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, ScrollView,
  TextInput, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

// --- INICIO DE LA MODIFICACIÓN (Imports de Firebase) ---
import { db } from '../firebaseConfig';
import { doc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
// --- FIN DE LA MODIFICACIÓN ---

const INITIAL_FORM_STATE = {
  nombre: '',
  descripcion: '',
  precio: '',
  imagen: '',
  estado: 'Disponible',
};

export default function AddProductScreen({ route, navigation }) {
  const { businessId } = route.params; // ID del negocio al que pertenece
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  // --- INICIO DE LA MODIFICACIÓN (Función de guardado REAL) ---
  const handleSaveProduct = async () => {
    if (!formData.nombre || !formData.precio) {
      Alert.alert('Campos requeridos', 'Por favor, completa nombre y precio.');
      return;
    }

    setLoading(true);

    try {
      // 1. Prepara el nuevo objeto de producto
      const newProduct = {
        ...formData,
        id: `prod_${Date.now()}`, 
        precio: parseFloat(formData.precio) || 0,
        
        // --- ESTA ES LA LÍNEA CORREGIDA ---
        // Reemplazamos serverTimestamp() por la hora local del dispositivo
        createdAt: new Date(), 
        // --- FIN DE LA CORRECCIÓN ---
      };

      // 2. Apunta al documento EXACTO del negocio
      const businessRef = doc(db, "businesses", businessId);

      // 3. Usa 'updateDoc' y 'arrayUnion' (esto se queda igual)
      await updateDoc(businessRef, {
        products: arrayUnion(newProduct)
      });

      setLoading(false);
      Alert.alert('¡Éxito!', 'Tu producto se ha registrado.');
      
      setFormData(INITIAL_FORM_STATE);
      navigation.goBack(); 

    } catch (error) {
      setLoading(false);
      console.error("Error al guardar producto: ", error);
      Alert.alert("Error", "No se pudo guardar el producto.");
    }
  };

  return (
    // ... (El resto de tu JSX se queda 100% igual) ...
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Añadir Producto/Servicio</Text>
        
        <View style={styles.form}>
          <Text style={styles.label}>Nombre *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Taco de Asada"
            value={formData.nombre}
            onChangeText={(text) => handleChange('nombre', text)}
          />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="Breve descripción del producto"
            value={formData.descripcion}
            onChangeText={(text) => handleChange('descripcion', text)}
            multiline
          />

          <Text style={styles.label}>Precio *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 25.00"
            value={formData.precio}
            onChangeText={(text) => handleChange('precio', text)}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Imagen (URL)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://ejemplo.com/imagen.png"
            value={formData.imagen}
            onChangeText={(text) => handleChange('imagen', text)}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Estado</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.estado}
              onValueChange={(itemValue) => handleChange('estado', itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Disponible" value="Disponible" />
              <Picker.Item label="No Disponible" value="No Disponible" />
            </Picker>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSaveProduct}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Guardar Producto</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// (Tus estilos se quedan 100% igual)
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#faebd7' },
  container: { flex: 1 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#333', marginTop: 20, marginBottom: 20, textAlign: 'center' },
  form: { paddingHorizontal: 25, paddingBottom: 40 },
  label: { fontSize: 16, color: '#333', marginBottom: 8, fontWeight: '600' },
  input: { backgroundColor: 'white', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 15, fontSize: 16, marginBottom: 20, borderWidth: 1, borderColor: '#DDD' },
  inputMultiline: { height: 100, textAlignVertical: 'top' },
  pickerContainer: { backgroundColor: 'white', borderRadius: 10, borderWidth: 1, borderColor: '#DDD', marginBottom: 20, justifyContent: 'center' },
  picker: { width: '100%', height: 50 },
  submitButton: { backgroundColor: '#e9967a', paddingVertical: 15, borderRadius: 30, alignItems: 'center', marginTop: 10, elevation: 3 },
  submitButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});