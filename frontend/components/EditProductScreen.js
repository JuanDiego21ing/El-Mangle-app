import React, { useState } from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, ScrollView,
  TextInput, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from '../firebaseConfig';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export default function EditProductScreen({ route, navigation }) {
  // (La lógica se queda 100% igual)
  const { product, businessId } = route.params;

  const [formData, setFormData] = useState({
    nombre: product.nombre,
    descripcion: product.descripcion,
    precio: product.precio.toString(),
    imagen: product.imagen || '',
    estado: product.estado,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleUpdateProduct = async () => {
    if (!formData.nombre || !formData.precio) {
      Alert.alert('Campos requeridos', 'Por favor, completa nombre y precio.');
      return;
    }
    setLoading(true);
    try {
      const updatedProduct = {
        ...product,
        ...formData,
        precio: parseFloat(formData.precio) || 0,
        updatedAt: new Date(),
      };

      const businessRef = doc(db, "businesses", businessId);
      await updateDoc(businessRef, { products: arrayRemove(product) });
      await updateDoc(businessRef, { products: arrayUnion(updatedProduct) });

      setLoading(false);
      Alert.alert('¡Éxito!', 'Tu producto se ha actualizado.');
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      console.error("Error al actualizar producto: ", error);
      Alert.alert("Error", "No se pudo actualizar el producto.");
    }
  };

  // (El JSX se queda 100% igual)
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Editar Producto/Servicio</Text>
        
        <View style={styles.form}>
          <Text style={styles.label}>Nombre *</Text>
          <TextInput
            style={styles.input}
            value={formData.nombre}
            onChangeText={(text) => handleChange('nombre', text)}
          />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={formData.descripcion}
            onChangeText={(text) => handleChange('descripcion', text)}
            multiline
          />

          <Text style={styles.label}>Precio *</Text>
          <TextInput
            style={styles.input}
            value={formData.precio}
            onChangeText={(text) => handleChange('precio', text)}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Imagen (URL)</Text>
          <TextInput
            style={styles.input}
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
            onPress={handleUpdateProduct}
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

// --- INICIO DE LA MODIFICACIÓN DE ESTILOS ---
// (Son idénticos a los de AddProductScreen)
const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' // <-- Fondo blanco
  },
  container: { 
    flex: 1 
  },
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#222222', // <-- Negro suave
    marginTop: 20, 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  form: { 
    paddingHorizontal: 25, 
    paddingBottom: 40 
  },
  label: { 
    fontSize: 16, 
    color: '#222222', // <-- Negro suave
    marginBottom: 8, 
    fontWeight: '600' 
  },
  input: { 
    backgroundColor: 'white', 
    borderRadius: 8, // <-- Bordes suaves
    paddingVertical: 12, 
    paddingHorizontal: 15, 
    fontSize: 16, 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: '#E0E0E0', // <-- Borde gris claro
    color: '#222222'
  },
  inputMultiline: { 
    height: 100, 
    textAlignVertical: 'top' 
  },
  pickerContainer: { 
    backgroundColor: 'white', 
    borderRadius: 8, // <-- Bordes suaves
    borderWidth: 1, 
    borderColor: '#E0E0E0', // <-- Borde gris claro
    marginBottom: 20, 
    justifyContent: 'center' 
  },
  picker: { 
    width: '100%', 
    height: 50,
    color: '#222222'
  },
  submitButton: { 
    backgroundColor: '#007AFF', // <-- Color primario (Azul)
    paddingVertical: 15, 
    borderRadius: 8, // <-- Bordes suaves
    alignItems: 'center', 
    marginTop: 10
  },
  submitButtonText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
});
// --- FIN DE LA MODIFICACIÓN DE ESTILOS ---