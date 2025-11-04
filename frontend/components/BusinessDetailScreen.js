import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, 
  Image, TouchableOpacity, FlatList, ActivityIndicator,
  Alert, Linking // <-- 1. Importamos 'Linking' para el teléfono/email
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from './AuthContext';
import { db } from '../firebaseConfig';
import { doc, onSnapshot, updateDoc, arrayRemove, deleteDoc } from 'firebase/firestore'; 

export default function BusinessDetailScreen({ route, navigation }) {
  const { user } = useAuth();
  const { businessId } = route.params;
  const [loading, setLoading] = useState(true);
  const [businessData, setBusinessData] = useState(route.params.businessData || null);

  // (El useEffect de Firestore se queda igual)
  useEffect(() => {
    setLoading(true);
    const docRef = doc(db, "businesses", businessId);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setBusinessData({ ...doc.data(), id: doc.id });
      } else {
        navigation.navigate("Home");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [businessId]);
  
  // (Las funciones de 'handleDeleteProduct' y 'handleDeleteBusiness' se quedan igual)
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
              const businessRef = doc(db, "businesses", businessId);
              await deleteDoc(businessRef);
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

  // (El 'renderProduct' se queda igual)
  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      {item.imagen ? (
        <Image source={{ uri: item.imagen }} style={styles.productImage} />
      ) : (
        <View style={styles.productImagePlaceholder}>
          <Ionicons name="image-outline" size={30} color="#CCC" />
        </View>
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.nombre}</Text>
        <Text style={styles.productDesc} numberOfLines={2}>{item.descripcion}</Text>
      </View>
      <View style={styles.productActions}>
        <Text style={styles.productPrice}>${item.precio.toFixed(2)}</Text>
        {isOwner && (
          <View style={styles.productButtonGroup}>
            <TouchableOpacity 
              style={styles.productEditButton}
              onPress={() => navigation.navigate('EditProduct', { 
                product: item,
                businessId: businessId 
              })}
            >
              <Ionicons name="pencil-outline" size={18} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.productDeleteButton}
              onPress={() => handleDeleteProduct(item)}
            >
              <Ionicons name="trash-outline" size={18} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  // (El 'loading' se queda igual)
  if (loading || !businessData) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.center]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  // --- 2. JSX MODIFICADO: Añadimos los nuevos campos de info ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <Image 
          source={{ uri: businessData.mainImageUrl }} 
          style={styles.mainImage} 
        />
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{businessData.nombre}</Text>
          <Text style={styles.category}>{businessData.category}</Text>
          
          {/* -- DESCRIPCIÓN -- */}
          <Text style={styles.description}>{businessData.descripcion}</Text>

          {/* -- INFO DE CONTACTO CON ICONOS -- */}
          <View style={styles.infoGroup}>
            {businessData.address && (
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={20} color="#555555" style={styles.infoIcon} />
                <Text style={styles.infoText}>{businessData.address}</Text>
              </View>
            )}
            {businessData.telefono && (
              <TouchableOpacity style={styles.infoRow} onPress={() => Linking.openURL(`tel:${businessData.telefono}`)}>
                <Ionicons name="call-outline" size={20} color="#555555" style={styles.infoIcon} />
                <Text style={styles.infoTextClickable}>{businessData.telefono}</Text>
              </TouchableOpacity>
            )}
            {businessData.email && (
              <TouchableOpacity style={styles.infoRow} onPress={() => Linking.openURL(`mailto:${businessData.email}`)}>
                <Ionicons name="mail-outline" size={20} color="#555555" style={styles.infoIcon} />
                <Text style={styles.infoTextClickable}>{businessData.email}</Text>
              </TouchableOpacity>
            )}
            {businessData.horario && (
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={20} color="#555555" style={styles.infoIcon} />
                <Text style={styles.infoText}>{businessData.horario}</Text>
              </View>
            )}
          </View>
        </View>

        {/* (El panel de admin se queda igual) */}
        {isOwner && (
          <View style={styles.adminPanel}>
            <Text style={styles.adminTitle}>Panel de Dueño</Text>
            <TouchableOpacity 
              style={styles.adminButton}
              onPress={() => navigation.navigate('EditBusiness', { 
                businessData: businessData
              })}
            >
              <Ionicons name="pencil-outline" size={20} color="white" style={styles.adminButtonIcon} />
              <Text style={styles.adminButtonText}>Editar Información del Negocio</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.adminButton, styles.adminButtonDelete]}
              onPress={handleDeleteBusiness}
            >
              <Ionicons name="trash-outline" size={20} color="white" style={styles.adminButtonIcon} />
              <Text style={styles.adminButtonText}>Eliminar Negocio</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* (La sección de productos se queda igual) */}
        <View style={styles.productsContainer}>
          <Text style={styles.sectionTitle}>Productos y Servicios</Text>
          {isOwner && (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('AddProduct', { businessId: businessData.id })}
            >
              <Ionicons name="add-circle-outline" size={20} color="white" style={styles.adminButtonIcon} />
              <Text style={styles.addButtonText}>Añadir Producto/Servicio</Text>
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

// --- 3. AÑADIMOS NUEVOS ESTILOS para la info de contacto ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  center: { justifyContent: 'center', alignItems: 'center' },
  mainImage: { width: '100%', height: 250, resizeMode: 'cover' },
  infoContainer: { 
    padding: 20, 
    borderBottomWidth: 1, 
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  title: { fontSize: 26, fontWeight: 'bold', color: '#222222' },
  category: { fontSize: 16, color: '#007AFF', fontWeight: '500', marginTop: 4, marginBottom: 15 },
  
  // -- Estilos NUEVOS para info --
  description: {
    fontSize: 15,
    color: '#555555',
    lineHeight: 22,
    marginBottom: 20,
  },
  infoGroup: {
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoIcon: {
    marginRight: 15,
  },
  infoText: {
    fontSize: 15,
    color: '#222222',
    flex: 1, // Para que el texto se ajuste
  },
  infoTextClickable: { // Para email y teléfono
    fontSize: 15,
    color: '#007AFF', // Azul
    flex: 1,
    textDecorationLine: 'underline',
  },
  
  // (El resto de estilos se queda igual)
  adminPanel: {
    padding: 20,
    backgroundColor: '#F7F7F7',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  adminTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 15,
  },
  adminButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  adminButtonDelete: {
    backgroundColor: '#E53E3E',
  },
  adminButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  adminButtonIcon: {
    marginRight: 8,
  },
  productsContainer: { 
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#222222',
    marginBottom: 15 
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  addButtonText: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: 'bold',
    marginLeft: 8,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
    resizeMode: 'cover',
  },
  productImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: { 
    flex: 1, 
    marginRight: 10 
  },
  productName: { 
    fontSize: 17, 
    fontWeight: 'bold', 
    color: '#222222' 
  },
  productDesc: { 
    fontSize: 13, 
    color: '#555555', 
    marginTop: 4 
  },
  productPrice: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#007AFF',
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  productActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  productButtonGroup: {
    flexDirection: 'row',
    marginTop: 0,
  },
  productEditButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginRight: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productDeleteButton: {
    backgroundColor: '#E53E3E',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: { 
    textAlign: 'center', 
    color: '#888', 
    fontStyle: 'italic', 
    padding: 20 
  }
});