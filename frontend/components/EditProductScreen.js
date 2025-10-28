import React, { useState } from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, ScrollView,
  TextInput, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from '../firebaseConfig';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export default function EditProductScreen({ route, navigation }) {
  // 1. Obtenemos el PRODUCTO a editar y el ID del negocio
  const { product, businessId } = route.params;

  // 2. Usamos los datos del producto para el estado inicial
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

  // 3. Lógica para ACTUALIZAR el producto
  const handleUpdateProduct = async () => {
    if (!formData.nombre || !formData.precio) {
      Alert.alert('Campos requeridos', 'Por favor, completa nombre y precio.');
      return;
    }
    setLoading(true);

    try {
      // 4. Creamos el NUEVO objeto del producto con los datos actualizados
      const updatedProduct = {
        ...product, // Mantenemos el ID y createdAt originales
        ...formData, // Sobrescribimos con los datos del formulario
        precio: parseFloat(formData.precio) || 0,
        updatedAt: new Date(), // Añadimos una fecha de actualización
      };

      const businessRef = doc(db, "businesses", businessId);

      // 5. Ejecutamos dos operaciones:
      // Primero, quitamos el producto original (el que recibimos en route.params)
      await updateDoc(businessRef, {
        products: arrayRemove(product) 
      });
      // Segundo, añadimos el producto actualizado
      await updateDoc(businessRef, {
        products: arrayUnion(updatedProduct)
      });

      setLoading(false);
      Alert.alert('¡Éxito!', 'Tu producto se ha actualizado.');
      navigation.goBack(); // Vuelve a la pantalla de detalle

    } catch (error) {
      setLoading(false);
      console.error("Error al actualizar producto: ", error);
      Alert.alert("Error", "No se pudo actualizar el producto.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 4. Cambiamos el título */}
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
            onPress={handleUpdateProduct} // 5. Llamamos a la función de actualizar
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              // 6. Cambiamos el texto del botón
              <Text style={styles.submitButtonText}>Guardar Cambios</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// (Los estilos son idénticos a los de AddProductScreen)
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