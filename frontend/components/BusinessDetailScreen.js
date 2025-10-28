import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, SafeAreaView, ScrollView, 
  Image, TouchableOpacity, FlatList, ActivityIndicator,
  Alert // <-- 1. Importamos Alert
} from 'react-native';
import { useAuth } from './AuthContext';
import { db } from '../firebaseConfig';
// --- 2. Importamos más funciones de Firestore ---
import { doc, onSnapshot, updateDoc, arrayRemove } from 'firebase/firestore'; 

export default function BusinessDetailScreen({ route, navigation }) {
  const { user } = useAuth();
  const { businessId } = route.params;
  const [loading, setLoading] = useState(true);
  const [businessData, setBusinessData] = useState(route.params.businessData || null);

  useEffect(() => {
    setLoading(true);
    const docRef = doc(db, "businesses", businessId);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setBusinessData({ ...doc.data(), id: doc.id });
      } else {
        navigation.goBack();
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [businessId]);
  
  // --- 3. NUEVA FUNCIÓN: Eliminar un producto ---
  const handleDeleteProduct = (productToDelete) => {
    Alert.alert(
      "Eliminar Producto",
      `¿Estás seguro de que quieres eliminar "${productToDelete.nombre}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive", 
          onPress: async () => {
            try {
              const businessRef = doc(db, "businesses", businessId);
              // Usamos 'arrayRemove' para quitar el objeto del array en Firestore
              await updateDoc(businessRef, {
                products: arrayRemove(productToDelete)
              });
              // El 'onSnapshot' de useEffect se encargará de actualizar la UI
              Alert.alert("Éxito", "Producto eliminado.");
            } catch (error) {
              console.error("Error al eliminar producto: ", error);
              Alert.alert("Error", "No se pudo eliminar el producto.");
            }
          } 
        }
      ]
    );
  };

  const isOwner = user && businessData && businessData.ownerId === user.uid;

  // --- 4. ACTUALIZAMOS RENDERPRODUCT ---
  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.nombre}</Text>
        <Text style={styles.productDesc}>{item.descripcion}</Text>
      </View>
      <View style={styles.productActions}>
        <Text style={styles.productPrice}>${item.precio.toFixed(2)}</Text>
        
        {/* Mostramos botones solo si es el dueño */}
        {isOwner && (
          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => navigation.navigate('EditProduct', { 
                product: item, // Pasamos el producto a editar
                businessId: businessId // Pasamos el ID del negocio
              })}
            >
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => handleDeleteProduct(item)} // Llamamos a la función de eliminar
            >
              <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  if (loading || !businessData) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.center]}>
        <ActivityIndicator size="large" color="#e9967a" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <Image source={{ uri: businessData.mainImageUrl }} style={styles.mainImage} />
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{businessData.nombre}</Text>
          <Text style={styles.category}>{businessData.category}</Text>
          <Text style={styles.address}>{businessData.address}</Text>
        </View>

        <View style={styles.productsContainer}>
          <Text style={styles.sectionTitle}>Productos y Servicios</Text>
          
          {isOwner && (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('AddProduct', { businessId: businessData.id })}
            >
              <Text style={styles.addButtonText}>+ Añadir Producto/Servicio</Text>
            </TouchableOpacity>
          )}

          <FlatList
            data={businessData.products} 
            renderItem={renderProduct} // 'renderProduct' ahora tiene los botones
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>Este negocio aún no tiene productos registrados.</Text>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- 5. ACTUALIZAMOS LOS ESTILOS ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  center: { justifyContent: 'center', alignItems: 'center' },
  mainImage: { width: '100%', height: 250 },
  infoContainer: { padding: 20, borderBottomWidth: 1, borderColor: '#EEE' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#333' },
  category: { fontSize: 16, color: '#e9967a', fontWeight: '500', marginTop: 4 },
  address: { fontSize: 16, color: '#666', marginTop: 10 },
  productsContainer: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  addButton: {
    backgroundColor: '#e9967a',
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  productInfo: { flex: 1, marginRight: 10 },
  productName: { fontSize: 16, fontWeight: 'bold', color: '#444' },
  productDesc: { fontSize: 14, color: '#777', marginTop: 4 },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#e9967a', alignSelf: 'flex-end' },
  emptyText: { textAlign: 'center', color: '#888', fontStyle: 'italic', padding: 20 },
  
  // -- Estilos NUEVOS para los botones --
  productActions: {
    alignItems: 'flex-end',
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#007bff', // Azul
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#dc3545', // Rojo
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  }
});