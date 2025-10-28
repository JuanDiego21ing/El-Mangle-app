import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, SafeAreaView, ScrollView, 
  Image, TouchableOpacity, FlatList, ActivityIndicator,
  Alert 
} from 'react-native';
import { useAuth } from './AuthContext';
import { db } from '../firebaseConfig';
// --- 1. Importamos 'deleteDoc' ---
import { doc, onSnapshot, updateDoc, arrayRemove, deleteDoc } from 'firebase/firestore'; 

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
        // Si el doc no existe (porque fue borrado), volvemos al Home
        navigation.navigate("Home");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [businessId]);
  
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
              await updateDoc(businessRef, {
                products: arrayRemove(productToDelete)
              });
              Alert.alert("Éxito", "Producto eliminado.");
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el producto.");
            }
          } 
        }
      ]
    );
  };
  
  // --- 2. NUEVA FUNCIÓN: Eliminar el Negocio (deleteDoc) ---
  const handleDeleteBusiness = () => {
    Alert.alert(
      "Eliminar Negocio",
      `¿Estás seguro de que quieres eliminar "${businessData.nombre}"? Esta acción no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar Definitivamente",
          style: "destructive",
          onPress: async () => {
            try {
              // Apunta al documento del negocio
              const businessRef = doc(db, "businesses", businessId);
              // Elimina el documento
              await deleteDoc(businessRef);
              
              // onSnapshot detectará el borrado y nos enviará al Home
              Alert.alert("Éxito", "Negocio eliminado.");
            } catch (error) {
              console.error("Error al eliminar negocio: ", error);
              Alert.alert("Error", "No se pudo eliminar el negocio.");
            }
          }
        }
      ]
    );
  };

  const isOwner = user && businessData && businessData.ownerId === user.uid;

  // (renderProduct se queda igual)
  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.nombre}</Text>
        <Text style={styles.productDesc}>{item.descripcion}</Text>
      </View>
      <View style={styles.productActions}>
        <Text style={styles.productPrice}>${item.precio.toFixed(2)}</Text>
        {isOwner && (
          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => navigation.navigate('EditProduct', { 
                product: item,
                businessId: businessId 
              })}
            >
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => handleDeleteProduct(item)}
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

        {/* --- 3. NUEVO BLOQUE: Panel de Administración del Negocio --- */}
        {isOwner && (
          <View style={styles.adminPanel}>
            <Text style={styles.adminTitle}>Panel de Dueño</Text>
            <TouchableOpacity 
              style={styles.adminButton}
              onPress={() => navigation.navigate('EditBusiness', { 
                businessData: businessData // Pasamos todos los datos al editor
              })}
            >
              <Text style={styles.adminButtonText}>Editar Información del Negocio</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.adminButton, styles.adminButtonDelete]}
              onPress={handleDeleteBusiness}
            >
              <Text style={styles.adminButtonText}>Eliminar Negocio</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* --- FIN DEL BLOQUE NUEVO --- */}

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
            renderItem={renderProduct}
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

// --- 4. AÑADIMOS NUEVOS ESTILOS para el panel de admin ---
const styles = StyleSheet.create({
  // (Tus estilos existentes: safeArea, center, mainImage, infoContainer... se quedan igual)
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  center: { justifyContent: 'center', alignItems: 'center' },
  mainImage: { width: '100%', height: 250 },
  infoContainer: { padding: 20, borderBottomWidth: 1, borderColor: '#EEE' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#333' },
  category: { fontSize: 16, color: '#e9967a', fontWeight: '500', marginTop: 4 },
  address: { fontSize: 16, color: '#666', marginTop: 10 },
  
  // -- Panel de Admin (NUEVO) --
  adminPanel: {
    padding: 20,
    backgroundColor: '#fff8f0',
    borderBottomWidth: 1,
    borderColor: '#EEE',
  },
  adminTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  adminButton: {
    backgroundColor: '#007bff', // Azul
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  adminButtonDelete: {
    backgroundColor: '#dc3545', // Rojo
  },
  adminButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // (Estilos de Productos, botones, etc. se quedan igual)
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
  productActions: {
    alignItems: 'flex-end',
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
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